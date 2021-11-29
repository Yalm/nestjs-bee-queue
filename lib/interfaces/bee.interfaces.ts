import { DoneCallback, Job } from "bee-queue";
import { BeeQueueProcessorCallback } from "../bee.types";

export interface BeeQueueAdvancedProcessor {
  concurrency?: number;
  name?: string;
  callback: BeeQueueProcessorCallback;
}

export type ProcessCallbackFunction<T, U> = (
  concurrency: number,
  handler: (job: Job<T>, done: DoneCallback<U>) => Promise<U>
) => void;
