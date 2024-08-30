import { Injectable } from "@nestjs/common";
import PgBoss, { WorkWithMetadataHandler } from "pg-boss";
import { Inject } from "@nestjs/common";
import { PGBOSS_TOKEN } from "./utils/consts";

@Injectable()
export class PgBossService {
  constructor(@Inject(PGBOSS_TOKEN) private readonly boss: PgBoss) {}

  async scheduleJob<TData extends object>(
    name: string,
    data: TData,
    options?: PgBoss.SendOptions,
  ) {
    await this.boss.send(name, data, options);
  }

  async scheduleCronJob<TData extends object>(
    name: string,
    cron: string,
    data?: TData,
    options?: PgBoss.ScheduleOptions,
  ) {
    await this.boss.schedule(name, cron, data ?? {}, options ?? {});
  }

  async registerCronJob<TData extends object>(
    name: string,
    cron: string,
    handler: WorkWithMetadataHandler<TData>,
    data?: TData,
    options?: PgBoss.ScheduleOptions,
  ) {
    await this.boss.schedule(name, cron, data ?? {}, options ?? {});
    await this.boss.work<TData>(
      name,
      { ...options, includeMetadata: true },
      handler,
    );
  }

  async registerJob<TData extends object>(
    name: string,
    handler: WorkWithMetadataHandler<TData>,
    options?: PgBoss.BatchWorkOptions,
  ) {
    await this.boss.work<TData>(
      name,
      { ...options, includeMetadata: true },
      handler,
    );
  }
}
