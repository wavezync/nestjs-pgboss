import PgBoss from "pg-boss";

export function transformOptions(
  options?: PgBoss.WorkOptions | PgBoss.ScheduleOptions,
) {
  if (!options) return {};

  const transformedOptions: any = { ...options };

  if (typeof options.priority === "number") {
    transformedOptions.priority = options.priority > 0;
  }

  return transformedOptions;
}

export function normalizeJob(job: any) {
  if (typeof job === "object" && "0" in job) {
    return job[0];
  }
  return job;
}
