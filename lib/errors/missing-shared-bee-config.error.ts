export class MissingBeeSharedConfigurationError extends Error {
  constructor(configKey: string, queueName: string) {
    super(
      `Configuration "${configKey}" referenced from the "Queue(${queueName})" options does not exist.`
    );
  }
}
