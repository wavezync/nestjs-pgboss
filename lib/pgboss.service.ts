import { Injectable } from "@nestjs/common";
import PgBoss, { WorkWithMetadataHandler } from "pg-boss";
import { Inject } from "@nestjs/common";
import { PGBOSS_TOKEN } from "./utils/consts";

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
    await this.ensureQueueExists(name);
    await this.pgBoss.send(name, data, options);
  }

  async scheduleCronJob<TData extends object>(
    name: string,
    cron: string,
    data?: TData,
    options?: PgBoss.ScheduleOptions,
  ) {
    await this.ensureQueueExists(name);
    await this.pgBoss.schedule(name, cron, data ?? {}, options ?? {});
  }

  async registerCronJob<TData extends object>(
    name: string,
    cron: string,
    handler: WorkWithMetadataHandler<TData>,
    data?: TData,
    options?: PgBoss.ScheduleOptions,
  ) {
    await this.ensureQueueExists(name);
    await this.pgBoss.schedule(name, cron, data ?? {}, options ?? {});
    await this.pgBoss.work<TData>(
      name,
      { ...this.transformOptions(options), includeMetadata: true },
      handler,
    );
  }

  async registerJob<TData extends object>(
    name: string,
    handler: WorkWithMetadataHandler<TData>,
    options?: PgBoss.WorkOptions,
  ) {
    await this.ensureQueueExists(name);
    await this.pgBoss.work<TData>(
      name,
      { ...options, includeMetadata: true },
      handler,
    );
  }
  private transformOptions(
    options?: PgBoss.WorkOptions | PgBoss.ScheduleOptions,
  ) {
    if (!options) return {};

    const transformedOptions: any = { ...options };

    if (typeof options.priority === "number") {
      transformedOptions.priority = options.priority > 0;
    }

    return transformedOptions;
  }

  async ensureQueueExists(queueName: string) {
    const currentQueue = await this.pgBoss.getQueue(queueName);
    if (!currentQueue) {
      await this.pgBoss.createQueue(queueName);
    }
  }
}
