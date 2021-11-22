import { flatten, OnApplicationShutdown, Provider } from '@nestjs/common';
import * as Bee from 'bee-queue';
import { createConditionalDepHolder, IConditionalDepHolder } from './helpers';
import { BeeModuleOptions } from './interfaces';
import {
  getQueueOptionsToken,
  getQueueToken,
  getSharedConfigToken,
} from './utils';

function buildQueue(options: BeeModuleOptions): Bee {
  const queueName = options.name ? options.name : 'default';
  const queue = new Bee(queueName, options);

  (queue as unknown as OnApplicationShutdown).onApplicationShutdown = function (
    this: Bee,
  ) {
    return this.close();
  };
  return queue;
}

export function createQueueOptionProviders(
  options: BeeModuleOptions[],
): Provider[] {
  const providers = options.map((option) => {
    const optionalSharedConfigHolder = createConditionalDepHolder(
      getSharedConfigToken(option.configKey),
    );
    return [
      optionalSharedConfigHolder,
      {
        provide: getQueueOptionsToken(option.name),
        useFactory: (optionalDepHolder: IConditionalDepHolder<Bee>) => {
          return {
            ...optionalDepHolder.getDependencyRef(option.name),
            ...option,
          };
        },
        inject: [optionalSharedConfigHolder],
      },
    ];
  });
  return flatten(providers);
}

export function createQueueProviders(options: BeeModuleOptions[]): Provider[] {
  return options.map((option) => ({
    provide: getQueueToken(option.name),
    useFactory: (o: BeeModuleOptions) => {
      const queueName = o.name || option.name;
      return buildQueue({ ...o, name: queueName });
    },
    inject: [getQueueOptionsToken(option.name)],
  }));
}