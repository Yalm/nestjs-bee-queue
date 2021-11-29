import { DoneCallback, Job } from "bee-queue";

export type BeeQueueProcessorCallback<T = unknown> = (
  job: Job<T>,
  done?: DoneCallback<T>
) => void;

export type BeeQueueEvent =
  | "ready"
  | "error"
  | "succeeded"
  | "stalled"
  | "retrying"
  | "failed"
  | "job succeeded"
  | "job retrying"
  | "job failed"
  | "job progress";

export type BeeQueueEventOptions = {
  eventName: BeeQueueEvent;
  id: string;
};

export type QueueEventDecoratorOptions = { id: string };
