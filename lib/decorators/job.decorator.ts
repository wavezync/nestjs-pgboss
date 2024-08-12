import { SetMetadata } from "@nestjs/common";
import { JobOptions } from "pg-boss";

export const JOB_NAME = "JOB_NAME";
export const JOB_OPTIONS = "JOB_OPTIONS";
export const CRON_EXPRESSION = "CRON_EXPRESSION";
export const CRON_OPTIONS = "CRON_OPTIONS";

export function Job<_TData extends object = any>(
  name: string,
  options: JobOptions = {},
) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    SetMetadata(JOB_NAME, name)(target, key, descriptor);
    SetMetadata(JOB_OPTIONS, options)(target, key, descriptor);
  };
}

export function Cron<_TData extends object = any>(
  name: string,
  cron: string,
  options: JobOptions = {},
) {
  return (target: any, key: string, descriptor: PropertyDescriptor) => {
    SetMetadata(JOB_NAME, name)(target, key, descriptor);
    SetMetadata(CRON_EXPRESSION, cron)(target, key, descriptor);
    SetMetadata(CRON_OPTIONS, options)(target, key, descriptor);
  };
}
