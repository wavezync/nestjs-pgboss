import {
  Module,
  DynamicModule,
  Global,
  Provider,
  Logger,
} from "@nestjs/common";
import PgBoss from "pg-boss";
import { PgBossService } from "./pgboss.service";
import { PGBOSS_OPTIONS, PGBOSS_TOKEN } from "./utils/consts";
import {
  PgBossModuleAsyncOptions,
  PgBossOptionsFactory,
} from "./interfaces/pgboss-module-options.interface";
import { Reflector } from "@nestjs/core";

@Global()
@Module({})
export class PgBossModule {
  static forRootAsync(options: PgBossModuleAsyncOptions): DynamicModule {
    const logger = new Logger(PgBossModule.name);

    const pgBossProvider: Provider = {
      provide: PGBOSS_TOKEN,
      useFactory: async (pgBossOptions) => {
        const boss = new PgBoss(pgBossOptions.connectionString);
        await boss.start();
        logger.log("PgBoss started successfully");
        return boss;
      },
      inject: [PGBOSS_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: PgBossModule,
      imports: options.imports || [],
      providers: [...asyncProviders, pgBossProvider, PgBossService, Reflector],
      exports: [PgBossService],
    };
  }

  private static createAsyncProviders(
    options: PgBossModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    const useClass = options.useClass as new (
      ...args: any[]
    ) => PgBossOptionsFactory;

    return [
      this.createAsyncOptionsProvider(options),
      { provide: useClass, useClass },
    ];
  }

  private static createAsyncOptionsProvider(
    options: PgBossModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: PGBOSS_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [(options.useClass || options.useExisting) as any];

    return {
      provide: PGBOSS_OPTIONS,
      useFactory: async (optionsFactory: PgBossOptionsFactory) =>
        optionsFactory.createPgBossOptions(),
      inject,
    };
  }
}
