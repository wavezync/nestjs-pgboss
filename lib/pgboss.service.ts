import { Inject, Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import PgBoss, { BatchWorkOptions, JobOptions, WorkHandler } from "pg-boss";
import { PGBOSS_TOKEN } from "./utils/consts";
import {
  JOB_NAME,
  JOB_OPTIONS,
  CRON_EXPRESSION,
  CRON_OPTIONS,
} from "./decorators/job.decorator";

@Injectable()
export class PgBossService implements OnModuleInit {
  private readonly logger = new Logger(PgBossService.name);
  private jobHandlers: any[] = [];

  constructor(
    @Inject(PGBOSS_TOKEN) private readonly boss: PgBoss,
    private readonly reflector: Reflector,
  ) {
    this.logger.debug(`PgBossService initialized`);
  }

  async onModuleInit() {
    this.logger.log("Initializing and registering jobs");
    await this.registerJobs();
  }

  async registerJobHandler(handler: any): Promise<void> {
    this.jobHandlers.push(handler);
  }

  private async registerJobs(): Promise<void> {
    this.logger.log(
      `Registering jobs for handlers: ${this.jobHandlers.length}`,
    );

    for (const handler of this.jobHandlers) {
      const prototype = Object.getPrototypeOf(handler);
      const methods = Object.getOwnPropertyNames(prototype).filter(
        (method) => method !== "constructor",
      );

      for (const method of methods) {
        const name = this.reflector.get<string>(JOB_NAME, prototype[method]);
        const options = this.reflector.get<BatchWorkOptions>(
          JOB_OPTIONS,
          prototype[method],
        );
        const cron = this.reflector.get<string>(
          CRON_EXPRESSION,
          prototype[method],
        );
        const cronOptions = this.reflector.get<JobOptions>(
          CRON_OPTIONS,
          prototype[method],
        );

        if (name) {
          if (cron) {
            await this.registerCronJob(
              name,
              cron,
              handler[method].bind(handler),
              {},
              cronOptions,
            );
            this.logger.log(`Registered cron job: ${name}`);
          } else {
            await this.registerJob(
              name,
              handler[method].bind(handler),
              options,
            );
            this.logger.log(`Registered job: ${name}`);
          }
        }
      }
    }
  }

  async registerJob<TData extends object>(
    name: string,
    handler: WorkHandler<TData>,
    options?: BatchWorkOptions,
  ) {
    await this.boss.work(name, options, handler);
  }

  async scheduleJob<TData extends object>(
    name: string,
    data: TData,
    options?: JobOptions,
  ) {
    await this.boss.send(name, data, options);
  }

  async registerCronJob<TData extends object>(
    name: string,
    cron: string,
    handler: WorkHandler<TData>,
    data?: TData,
    options?: PgBoss.ScheduleOptions,
  ) {
    await this.boss.schedule(name, cron, data ?? {}, options ?? {});
    await this.boss.work(name, handler);
  }
}
