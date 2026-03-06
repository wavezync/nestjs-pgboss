import { WorkOptions, ScheduleOptions } from "pg-boss";

export function transformOptions(
  options?: WorkOptions | ScheduleOptions,
): Record<string, unknown> {
  if (!options) return {};

  const transformedOptions: Record<string, unknown> = { ...options };
  const opts = options as Record<string, unknown>;

  if (typeof opts.priority === "number") {
    transformedOptions.priority = opts.priority > 0;
  }

  return transformedOptions;
}

export function normalizeJob(job: unknown): unknown {
  if (typeof job === "object" && job !== null && "0" in job) {
    return (job as Record<string, unknown>)["0"];
  }
  return job;
}
