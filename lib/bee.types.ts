import { DoneCallback, Job } from "bee-queue";
import {
  BeeQueueAdvancedProcessor,
  BeeQueueAdvancedSeparateProcessor,
} from "./interfaces/bee.interfaces";

export type BeeQueueProcessor =
  | BeeQueueProcessorCallback
  | BeeQueueAdvancedProcessor
  | BeeQueueSeparateProcessor
  | BeeQueueAdvancedSeparateProcessor;

export type BeeQueueProcessorCallback<T = unknown> = (
  job: Job<T>,
  done?: DoneCallback<T>
) => void;

export type BeeQueueSeparateProcessor = string;

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
