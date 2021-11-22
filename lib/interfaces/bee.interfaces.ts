import { DoneCallback, Job } from "bee-queue";
import {
  BeeQueueProcessorCallback,
  BeeQueueSeparateProcessor,
} from "../bee.types";

export interface BeeQueueAdvancedProcessor {
  concurrency?: number;
  name?: string;
  callback: BeeQueueProcessorCallback;
}

export interface BeeQueueAdvancedSeparateProcessor {
  concurrency?: number;
  name?: string;
  path: BeeQueueSeparateProcessor;
}

export type ProcessCallbackFunction<T, U> = (
  concurrency: number,
  handler: (job: Job<T>, done: DoneCallback<U>) => Promise<U>
) => void;
