import { DynamicModule, Module, Provider, Type } from "@nestjs/common";
import { DiscoveryModule } from "@nestjs/core";
import * as Bee from "bee-queue";
import { BeeMetadataAccessor } from "./bee-metadata.accessor";
import { BeeExplorer } from "./bee.explorer";
import {
  createQueueOptionProviders,
  createQueueProviders,
} from "./bee.providers";
import {
  createConditionalDepHolder,
  IConditionalDepHolder,
} from "./helpers/create-conditional-dep-holder.helper";
import {
  SharedBeeAsyncConfiguration,
  SharedBeeConfigurationFactory,
} from "./interfaces";
import {
  BeeModuleAsyncOptions,
  BeeModuleOptions,
  BeeOptionsFactory,
} from "./interfaces/bee-module-options.interface";
import { getSharedConfigToken } from "./utils";
import { getQueueOptionsToken } from "./utils/get-queue-options-token.util";

@Module({})
export class BeeModule {
  /**
   * Registers a globally available configuration for all queues.
   *
   * @param beeConfig shared bee configuration object
   */
  static forRoot(beeConfig: Bee.QueueSettings): DynamicModule;
  /**
   * Registers a globally available configuration under a specified "configKey".
   *
   * @param configKey a key under which the configuration should be available
   * @param sharedBeeConfig shared bee configuration object
   */
  static forRoot(
    configKey: string,
    beeConfig: Bee.QueueSettings
  ): DynamicModule;
  /**
   * Registers a globally available configuration for all queues
   * or using a specified "configKey" (if passed).
   *
   * @param keyOrConfig a key under which the configuration should be available or a bee configuration object
   * @param beeConfig bee configuration object
   */
  static forRoot(
    keyOrConfig: string | Bee.QueueSettings,
    beeConfig?: Bee.QueueSettings
  ): DynamicModule {
    const [configKey, sharedBeeConfig] =
      typeof keyOrConfig === "string"
        ? [keyOrConfig, beeConfig]
        : [undefined, keyOrConfig];

    const sharedBeeConfigProvider: Provider = {
      provide: getSharedConfigToken(configKey),
      useValue: sharedBeeConfig,
    };

    return {
      global: true,
      module: BeeModule,
      providers: [sharedBeeConfigProvider],
      exports: [sharedBeeConfigProvider],
    };
  }

  /**
   * Registers a globally available configuration for all queues.
   *
   * @param asyncBeeConfig shared bee configuration async factory
   */
  static forRootAsync(
    asyncBeeConfig: SharedBeeAsyncConfiguration
  ): DynamicModule;
  /**
   * Registers a globally available configuration under a specified "configKey".
   *
   * @param configKey a key under which the configuration should be available
   * @param asyncBeeConfig shared bee configuration async factory
   */
  static forRootAsync(
    configKey: string,
    asyncBeeConfig: SharedBeeAsyncConfiguration
  ): DynamicModule;
  /**
   * Registers a globally available configuration for all queues
   * or using a specified "configKey" (if passed).
   *
   * @param keyOrAsyncConfig a key under which the configuration should be available or a bee configuration object
   * @param asyncBeeConfig shared bee configuration async factory
   */
  static forRootAsync(
    keyOrAsyncConfig: string | SharedBeeAsyncConfiguration,
    asyncBeeConfig?: SharedBeeAsyncConfiguration
  ): DynamicModule {
    const [configKey, asyncSharedBeeConfig] =
      typeof keyOrAsyncConfig === "string"
        ? [keyOrAsyncConfig, asyncBeeConfig]
        : [undefined, keyOrAsyncConfig];

    const imports = this.getUniqImports([asyncSharedBeeConfig]);
    const providers = this.createAsyncSharedConfigurationProviders(
      configKey,
      asyncSharedBeeConfig
    );

    return {
      global: true,
      module: BeeModule,
      imports,
      providers,
      exports: providers,
    };
  }

  static registerQueue(...options: BeeModuleOptions[]): DynamicModule {
    const queueProviders = createQueueProviders([].concat(options));
    const queueOptionProviders = createQueueOptionProviders([].concat(options));
    return {
      module: BeeModule,
      imports: [BeeModule.registerCore()],
      providers: [...queueOptionProviders, ...queueProviders],
      exports: queueProviders,
    };
  }

  static registerQueueAsync(
    ...options: BeeModuleAsyncOptions[]
  ): DynamicModule {
    const optionsArr = [].concat(options);
    const queueProviders = createQueueProviders(optionsArr);
    const imports = this.getUniqImports(optionsArr);
    const asyncQueueOptionsProviders = options
      .map((queueOptions) => this.createAsyncProviders(queueOptions))
      .reduce((a, b) => a.concat(b), []);

    return {
      imports: imports.concat(BeeModule.registerCore()),
      module: BeeModule,
      providers: [...asyncQueueOptionsProviders, ...queueProviders],
      exports: queueProviders,
    };
  }

  private static createAsyncProviders(
    options: BeeModuleAsyncOptions
  ): Provider[] {
    const optionalSharedConfigHolder = createConditionalDepHolder(
      getSharedConfigToken(options.configKey)
    );

    if (options.useExisting || options.useFactory) {
      return [
        optionalSharedConfigHolder,
        this.createAsyncOptionsProvider(options, optionalSharedConfigHolder),
      ];
    }
    if (!options.useClass) {
      // fallback to the "registerQueue" in case someone accidentally used the "registerQueueAsync" instead
      return createQueueOptionProviders([options]);
    }
    const useClass = options.useClass as Type<BeeOptionsFactory>;
    return [
      optionalSharedConfigHolder,
      this.createAsyncOptionsProvider(options, optionalSharedConfigHolder),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    asyncOptions: BeeModuleAsyncOptions,
    optionalSharedConfigHolderRef: Type<
      IConditionalDepHolder<Bee.QueueSettings>
    >
  ): Provider {
    if (asyncOptions.useFactory) {
      return {
        provide: getQueueOptionsToken(asyncOptions.name),
        useFactory: async (
          optionalDepHolder: IConditionalDepHolder<Bee.QueueSettings>,
          ...factoryArgs: unknown[]
        ) => {
          return {
            ...optionalDepHolder.getDependencyRef(asyncOptions.name),
            ...(await asyncOptions.useFactory(...factoryArgs)),
          };
        },
        inject: [optionalSharedConfigHolderRef, ...(asyncOptions.inject || [])],
      };
    }
    // `as Type<BeeOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (asyncOptions.useClass ||
        asyncOptions.useExisting) as Type<BeeOptionsFactory>,
    ];
    return {
      provide: getQueueOptionsToken(asyncOptions.name),
      useFactory: async (
        optionalDepHolder: IConditionalDepHolder<Bee.QueueSettings>,
        optionsFactory: BeeOptionsFactory
      ) => {
        return {
          ...optionalDepHolder.getDependencyRef(asyncOptions.name),
          ...(await optionsFactory.createBeeOptions()),
        };
      },
      inject: [optionalSharedConfigHolderRef, ...inject],
    };
  }

  private static createAsyncSharedConfigurationProviders(
    configKey: string | undefined,
    options: SharedBeeAsyncConfiguration
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncSharedConfigurationProvider(configKey, options)];
    }
    const useClass = options.useClass as Type<SharedBeeConfigurationFactory>;
    return [
      this.createAsyncSharedConfigurationProvider(configKey, options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncSharedConfigurationProvider(
    configKey: string | undefined,
    options: SharedBeeAsyncConfiguration
  ): Provider {
    if (options.useFactory) {
      return {
        provide: getSharedConfigToken(configKey),
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // `as Type<SharedBeeConfigurationFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass ||
        options.useExisting) as Type<SharedBeeConfigurationFactory>,
    ];
    return {
      provide: getSharedConfigToken(configKey),
      useFactory: async (optionsFactory: SharedBeeConfigurationFactory) =>
        optionsFactory.createSharedConfiguration(),
      inject,
    };
  }

  private static registerCore() {
    return {
      global: true,
      module: BeeModule,
      imports: [DiscoveryModule],
      providers: [BeeExplorer, BeeMetadataAccessor],
    };
  }

  private static getUniqImports(
    options: Array<BeeModuleAsyncOptions | SharedBeeAsyncConfiguration>
  ) {
    return (
      options
        .map((option) => option.imports)
        .reduce((acc, i) => acc.concat(i || []), [])
        .filter((v, i, a) => a.indexOf(v) === i) || []
    );
  }
}
