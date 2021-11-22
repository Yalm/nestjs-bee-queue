export function getQueueOptionsToken(name?: string): string {
    return name ? `BeeQueueOptions_${name}` : 'BeeQueueOptions_default';
}