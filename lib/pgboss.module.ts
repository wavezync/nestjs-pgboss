import {
  DynamicModule,
  Global,
  Logger,
  Module,
  OnModuleInit,
  OnApplicationBootstrap,
  OnModuleDestroy,
  Inject,
} from "@nestjs/common";
import { MetadataScanner } from "@nestjs/core";
import PgBoss, { ConstructorOptions } from "pg-boss";
import { defer, lastValueFrom } from "rxjs";
import { PgBossService } from "./pgboss.service";
import { LOGGER, PGBOSS_OPTIONS, PGBOSS_TOKEN } from "./utils/consts";
import {
  PgBossModuleAsyncOptions,
  PgBossOptionsFactory,
} from "./interfaces/pgboss-module-options.interface";
import { HandlerScannerService } from "./handler-scanner.service";
import { handleRetry } from "./utils/handleRetry";

@Global()
@Module({
  providers: [MetadataScanner, HandlerScannerService],
})
export class PgBossModule
  implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy
{
  private readonly logger = new Logger(LOGGER);

  constructor(
    @Inject(PGBOSS_TOKEN) private readonly boss: PgBoss,
    private readonly handlerScannerService: HandlerScannerService,
  ) {
    this.boss.on("error", (error: Error) => {
      this.logger.error(`PgBoss error: ${error.message}`, error.stack);
    });
  }

  static forRootAsync(options: PgBossModuleAsyncOptions): DynamicModule {
    const logger = new Logger(LOGGER);

    const pgBossProvider = {
      provide: PGBOSS_TOKEN,
      useFactory: async (pgBossOptions: ConstructorOptions) => {
        const boss = await lastValueFrom(
          defer(() => new PgBoss(pgBossOptions).start()).pipe(
            handleRetry(pgBossOptions.retryLimit, pgBossOptions.retryDelay),
          ),
        );
        boss.on("error", (error: Error) => {
          logger.error(`PgBoss error: ${error.message}`, error.stack);
        });
        logger.log("PgBoss started successfully");
        return boss;
      },
      inject: [PGBOSS_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: PgBossModule,
      imports: options.imports || [],
      providers: [
        ...asyncProviders,
        pgBossProvider,
        PgBossService,
        HandlerScannerService,
        MetadataScanner,
      ],
      exports: [PgBossService, PGBOSS_TOKEN],
    };
  }

  private static createAsyncProviders(options: PgBossModuleAsyncOptions) {
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

  private static createAsyncOptionsProvider(options: PgBossModuleAsyncOptions) {
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

  onModuleInit() {}

  async onApplicationBootstrap(): Promise<void> {
    await this.setupWorkers();
  }

  async onModuleDestroy(): Promise<void> {
    try {
      if (this.boss) {
        await this.boss.stop();
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  private async setupWorkers() {
    await this.handlerScannerService.scanAndRegisterHandlers();
  }
}
