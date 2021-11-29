import { SetMetadata } from "@nestjs/common";
import { BEE_MODULE_QUEUE_PROCESS } from "../bee.constants";

export interface ProcessOptions {
  concurrency: number;
}

export function Process(): MethodDecorator;
export function Process(options: ProcessOptions): MethodDecorator;
export function Process(
  options?:  ProcessOptions
): MethodDecorator {
  return SetMetadata(BEE_MODULE_QUEUE_PROCESS, options || {});
}