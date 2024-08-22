import { JobOptions, BatchWorkOptions } from "pg-boss";

export function convertToBatchWorkOptions(
  jobOptions: JobOptions = {},
): BatchWorkOptions {
  return {
    ...jobOptions,
    batchSize: 1,
  };
}
