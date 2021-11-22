import {
  FactoryProvider,
  ModuleMetadata,
  Type,
} from "@nestjs/common/interfaces";
import { QueueSettings } from "bee-queue";

export interface SharedBeeConfigurationFactory {
  createSharedConfiguration(): Promise<QueueSettings> | QueueSettings;
}

export interface SharedBeeAsyncConfiguration
  extends Pick<ModuleMetadata, "imports"> {
  /**
   * Existing Provider to be used.
   */
  useExisting?: Type<SharedBeeConfigurationFactory>;

  /**
   * Type (class name) of provider (instance to be registered and injected).
   */
  useClass?: Type<SharedBeeConfigurationFactory>;

  /**
   * Factory function that returns an instance of the provider to be injected.
   */
  useFactory?: (...args: any[]) => Promise<QueueSettings> | QueueSettings;

  /**
   * Optional list of providers to be injected into the context of the Factory function.
   */
  inject?: FactoryProvider["inject"];
}
