import { WorkOptions, ScheduleOptions } from "pg-boss";

export interface HandlerMetadata {
  jobName: string;
  workOptions?: WorkOptions;
  cronExpression?: string;
  cronOptions?: ScheduleOptions;
}
