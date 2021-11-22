import { SetMetadata } from "@nestjs/common";
import { BEE_MODULE_ON_QUEUE_EVENT } from "../bee.constants";
import {
  BeeQueueEvent,
  BeeQueueEventOptions,
  QueueEventDecoratorOptions,
} from "../bee.types";
import { BeeQueueEvents, BeeQueueGlobalEvents } from "../enums";

export const OnQueueEvent = (
  eventNameOrOptions: BeeQueueEvent | BeeQueueEventOptions
): MethodDecorator =>
  SetMetadata(
    BEE_MODULE_ON_QUEUE_EVENT,
    typeof eventNameOrOptions === "string"
      ? { eventName: eventNameOrOptions }
      : eventNameOrOptions
  );

export const OnQueueError = (options?: QueueEventDecoratorOptions) =>
  OnQueueEvent({ ...options, eventName: BeeQueueEvents.ERROR });

export const OnQueueReady = (options?: QueueEventDecoratorOptions) =>
  OnQueueEvent({ ...options, eventName: BeeQueueEvents.READY });

export const OnQueueStalled = (options?: QueueEventDecoratorOptions) =>
  OnQueueEvent({ ...options, eventName: BeeQueueEvents.STALLED });

export const OnQueueSucceeded = (options?: QueueEventDecoratorOptions) =>
  OnQueueEvent({ ...options, eventName: BeeQueueEvents.SUCCEEDED });

export const OnQueueFailed = (options?: QueueEventDecoratorOptions) =>
  OnQueueEvent({ ...options, eventName: BeeQueueEvents.FAILED });

export const OnGlobalQueueSucceeded = (options?: QueueEventDecoratorOptions) =>
  OnQueueEvent({ ...options, eventName: BeeQueueGlobalEvents.SUCCEEDED });

export const OnGlobalQueueRetrying = (options?: QueueEventDecoratorOptions) =>
  OnQueueEvent({ ...options, eventName: BeeQueueGlobalEvents.RETRYING });

export const OnGlobalQueueFailed = (options?: QueueEventDecoratorOptions) =>
  OnQueueEvent({ ...options, eventName: BeeQueueGlobalEvents.FAILED });

export const OnGlobalQueueProgress = (options?: QueueEventDecoratorOptions) =>
  OnQueueEvent({ ...options, eventName: BeeQueueGlobalEvents.PROGRESS });
