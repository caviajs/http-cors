import { Logger } from '@caviajs/logger';
import { Injector } from './injector';
import { Provider } from './types/provider';
import { OnApplicationBoot, OnApplicationListen, OnApplicationShutdown } from './types/hooks';
import { isTypeProvider } from './utils/is-type-provider';
import { isClassProvider } from './utils/is-class-provider';
import { LOGGER_CONTEXT } from './constants';

export class ApplicationRef {
  public static async compile(options: ApplicationRefOptions): Promise<ApplicationRef> {
    const injector: Injector = await Injector.create(options.providers);
    const logger: Logger = await injector.find(Logger);

    logger?.trace('Starting application...', LOGGER_CONTEXT);

    return new ApplicationRef(injector).boot();
  }

  protected constructor(
    public readonly injector: Injector,
  ) {
  }

  public async listen(): Promise<void> {
    for (const provider of await this.injector.filter(it => isTypeProvider(it) || isClassProvider(it))) {
      if ((provider as OnApplicationListen).onApplicationListen) {
        await provider.onApplicationListen();
      }
    }
  }

  public async shutdown(signal?: string): Promise<void> {
    for (const provider of await this.injector.filter(it => isTypeProvider(it) || isClassProvider(it))) {
      if ((provider as OnApplicationShutdown).onApplicationShutdown) {
        await provider.onApplicationShutdown(signal);
      }
    }
  }

  private async boot(): Promise<ApplicationRef> {
    for (const provider of await this.injector.filter(it => isTypeProvider(it) || isClassProvider(it))) {
      if ((provider as OnApplicationBoot).onApplicationBoot) {
        await provider.onApplicationBoot();
      }
    }

    return this;
  }
}

export interface ApplicationRefOptions {
  providers?: Provider[];
}