export function getQueueToken(name?: string): string {
    return name ? `BeeQueue_${name}` : 'BeeQueue_default';
}