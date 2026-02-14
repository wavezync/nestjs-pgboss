import { SetMetadata } from "@nestjs/common";
import { ScheduleOptions, WorkOptions } from "pg-boss";

export const JOB_NAME = "JOB_NAME";
export const JOB_OPTIONS = "JOB_OPTIONS";
export const CRON_EXPRESSION = "CRON_EXPRESSION";
export const CRON_OPTIONS = "CRON_OPTIONS";
export const PG_BOSS_JOB_METADATA = "PG_BOSS_JOB_METADATA";
export const WORK_NAME = "WORK_NAME";
export const WORK_OPTIONS = "WORK_OPTIONS";

export function Job<_TData extends object = any>(
  name: string,
  options: WorkOptions = {},
) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    SetMetadata(JOB_NAME, name)(target, key, descriptor);
    SetMetadata(JOB_OPTIONS, options)(target, key, descriptor);
    SetMetadata(PG_BOSS_JOB_METADATA, { jobName: name, workOptions: options })(
      target,
      key,
      descriptor,
    );
  };
}

export function CronJob<_TData extends object = any>(
  name: string,
  cron: string,
  options: ScheduleOptions = {},
) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    SetMetadata(JOB_NAME, name)(target, key, descriptor);
    SetMetadata(CRON_EXPRESSION, cron)(target, key, descriptor);
    SetMetadata(CRON_OPTIONS, options)(target, key, descriptor);
    SetMetadata(PG_BOSS_JOB_METADATA, { jobName: name, workOptions: options })(
      target,
      key,
      descriptor,
    );
  };
}
