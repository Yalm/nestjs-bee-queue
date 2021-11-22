export const BEE_CONFIG_DEFAULT_TOKEN = 'BEE_CONFIG(default)';

export function getSharedConfigToken(configKey?: string): string {
  return configKey ? `BEE_CONFIG(${configKey})` : BEE_CONFIG_DEFAULT_TOKEN;
}