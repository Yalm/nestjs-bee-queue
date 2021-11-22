import { QueueSettings } from "bee-queue";
import {
  FactoryProvider,
  ModuleMetadata,
  Type,
} from '@nestjs/common/interfaces';

export interface BeeModuleOptions extends QueueSettings {
  /**
   * Queue name
   *
   * @default default
   */
  name?: string;

  /**
   * Shared configuration key
   *
   * @default default
   */
  configKey?: string;
}

export interface BeeOptionsFactory {
  createBeeOptions(): Promise<BeeModuleOptions> | BeeModuleOptions;
}

export interface BeeModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  /**
   * Queue name.
   *
   * @default default
   */
  name?: string;

  /**
   * Shared configuration key.
   */
  configKey?: string;

  /**
   * Existing Provider to be used.
   */
  useExisting?: Type<BeeOptionsFactory>;

  /**
   * Type (class name) of provider (instance to be registered and injected).
   */
  useClass?: Type<BeeOptionsFactory>;

  /**
   * Factory function that returns an instance of the provider to be injected.
   */
  useFactory?: (
    ...args: any[]
  ) => Promise<BeeModuleOptions> | BeeModuleOptions;

  /**
   * Optional list of providers to be injected into the context of the Factory function.
   */
  inject?: FactoryProvider['inject'];
}