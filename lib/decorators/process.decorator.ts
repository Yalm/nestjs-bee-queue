import { SetMetadata } from '@nestjs/common';
import { isString } from 'util';
import { BEE_MODULE_QUEUE_PROCESS } from '../bee.constants';

export interface ProcessOptions {
  id?: string;
  concurrency?: number;
}

export function Process(): MethodDecorator;
export function Process(id: string): MethodDecorator;
export function Process(options: ProcessOptions): MethodDecorator;
export function Process(
  nameOrOptions?: string | ProcessOptions,
): MethodDecorator {
  const options = isString(nameOrOptions)
    ? { name: nameOrOptions }
    : nameOrOptions;
  return SetMetadata(BEE_MODULE_QUEUE_PROCESS, options || {});
}