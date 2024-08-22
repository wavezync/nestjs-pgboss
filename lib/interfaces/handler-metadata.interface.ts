import { JobOptions } from "pg-boss";

export interface HandlerMetadata {
  jobName: string;
  workOptions?: JobOptions;
  cronExpression?: string;
  cronOptions?: JobOptions;
}
