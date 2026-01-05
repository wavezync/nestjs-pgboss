import { WorkOptions, ScheduleOptions } from "pg-boss";

export function transformOptions(options?: WorkOptions | ScheduleOptions) {
  if (!options) return {};

  const transformedOptions: any = { ...options };

  if (typeof (options as any).priority === "number") {
    transformedOptions.priority = (options as any).priority > 0;
  }

  return transformedOptions;
}

export function normalizeJob(job: any) {
  if (typeof job === "object" && "0" in job) {
    return job[0];
  }
  return job;
}
