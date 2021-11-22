import { Injectable, Type } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  BEE_MODULE_ON_QUEUE_EVENT,
  BEE_MODULE_QUEUE,
  BEE_MODULE_QUEUE_PROCESS,
} from './bee.constants';
import { BeeQueueEventOptions } from './bee.types';
import { ProcessOptions } from './decorators';

@Injectable()
export class BeeMetadataAccessor {
  constructor(private readonly reflector: Reflector) {}

  isQueueComponent(target: Type<any> | Function): boolean {
    if (!target) {
      return false;
    }
    return !!this.reflector.get(BEE_MODULE_QUEUE, target);
  }

  isProcessor(target: Type<any> | Function): boolean {
    if (!target) {
      return false;
    }
    return !!this.reflector.get(BEE_MODULE_QUEUE_PROCESS, target);
  }

  isListener(target: Type<any> | Function): boolean {
    if (!target) {
      return false;
    }
    return !!this.reflector.get(BEE_MODULE_ON_QUEUE_EVENT, target);
  }

  getQueueComponentMetadata(target: Type<any> | Function): any {
    return this.reflector.get(BEE_MODULE_QUEUE, target);
  }

  getProcessMetadata(target: Type<any> | Function): ProcessOptions | undefined {
    return this.reflector.get(BEE_MODULE_QUEUE_PROCESS, target);
  }

  getListenerMetadata(
    target: Type<any> | Function,
  ): BeeQueueEventOptions | undefined {
    return this.reflector.get(BEE_MODULE_ON_QUEUE_EVENT, target);
  }
}