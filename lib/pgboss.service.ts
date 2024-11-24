import { Injectable } from "@nestjs/common";
import PgBoss, { WorkWithMetadataHandler } from "pg-boss";
import { Inject } from "@nestjs/common";
import { PGBOSS_TOKEN } from "./utils/consts";
import { transformOptions } from "./utils/helpers";

@Injectable()
export class PgBossService {
  private pgBoss: PgBoss;

  constructor(@Inject(PGBOSS_TOKEN) boss: PgBoss) {
    this.pgBoss = boss;
  }

  get boss(): PgBoss {
    return this.pgBoss;
  }

  async scheduleJob<TData extends object>(
    name: string,
    data: TData,
    options?: PgBoss.SendOptions,
  ) {
    await this.pgBoss.createQueue(name);
    await this.pgBoss.send(name, data, options);
  }

  async scheduleCronJob<TData extends object>(
    name: string,
    cron: string,
    data?: TData,
    options?: PgBoss.ScheduleOptions,
  ) {
    await this.pgBoss.createQueue(name);
    await this.pgBoss.schedule(name, cron, data ?? {}, options ?? {});
  }

  async registerCronJob<TData extends object>(
    name: string,
    cron: string,
    handler: WorkWithMetadataHandler<TData>,
    data?: TData,
    options?: PgBoss.ScheduleOptions,
  ) {
    await this.pgBoss.createQueue(name);
    await this.pgBoss.schedule(name, cron, data ?? {}, options ?? {});
    await this.pgBoss.work<TData>(
      name,
      { ...transformOptions(options), includeMetadata: true },
      handler,
    );
  }

  async registerJob<TData extends object>(
    name: string,
    handler: WorkWithMetadataHandler<TData>,
    options?: PgBoss.WorkOptions,
  ) {
    await this.pgBoss.createQueue(name);
    await this.pgBoss.work<TData>(
      name,
      { ...options, includeMetadata: true },
      handler,
    );
  }

  async registerWorker<TData extends object>(
    name: string,
    handler: (jobs: PgBoss.JobWithMetadata<TData>[]) => Promise<void>,
    options?: PgBoss.WorkOptions,
  ) {
    await this.pgBoss.createQueue(name);
    await this.pgBoss.work<TData>(
      name,
      { ...options, includeMetadata: true },
      async (jobs) => {
        const jobArray = Array.isArray(jobs) ? jobs : [jobs];
        await handler(jobArray);
      },
    );
  }
}
