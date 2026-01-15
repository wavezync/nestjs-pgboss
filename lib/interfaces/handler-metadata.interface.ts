import { WorkOptions as PgBossWorkOptions, ScheduleOptions } from "pg-boss";

export interface WorkOptions extends PgBossWorkOptions {
  teamSize?: number;
}

export interface HandlerMetadata {
  jobName: string;
  workOptions?: WorkOptions;
  cronExpression?: string;
  cronOptions?: ScheduleOptions;
}
