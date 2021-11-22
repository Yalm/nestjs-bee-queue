import { Inject, mixin, Optional, Type } from '@nestjs/common';
import { MissingBeeSharedConfigurationError } from '../errors/missing-shared-bee-config.error';
import { BEE_CONFIG_DEFAULT_TOKEN } from '../utils';

export interface IConditionalDepHolder<T = any> {
  getDependencyRef(caller: string): T;
}

export function createConditionalDepHolder<T = any>(
  depToken: string,
  optionalDep = BEE_CONFIG_DEFAULT_TOKEN,
  errorFactory = (caller: string) =>
    new MissingBeeSharedConfigurationError(depToken, caller),
): Type<IConditionalDepHolder> {
  class ConditionalDepHolder {
    constructor(@Optional() @Inject(depToken) public _dependencyRef: T) {}

    getDependencyRef(caller: string): T {
      if (depToken !== optionalDep && !this._dependencyRef) {
        throw errorFactory(caller);
      }
      return this._dependencyRef;
    }
  }
  return mixin(ConditionalDepHolder);
}