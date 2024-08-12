import { Inject, Injectable } from "@nestjs/common";
import PgBoss, { BatchWorkOptions, JobOptions, WorkHandler } from "pg-boss";
import { PGBOSS_TOKEN } from "./utils/consts";

@Injectable()
export class PgBossService {
  constructor(@Inject(PGBOSS_TOKEN) private readonly boss: PgBoss) {}

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
    await this.boss.schedule(
      name,
      cron,
      data ? data : {},
      options ? options : {},
    );
    await this.boss.work(name, handler);
  }
}
