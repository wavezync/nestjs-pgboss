import { defer, of, throwError } from "rxjs";
import { mergeMap, retryWhen, take, delay } from "rxjs/operators";

export function handleRetry(
  retryAttempts = 9,
  retryDelay = 3000,
  verbose = false,
  toRetry: (err: any) => boolean = (err: any) => true,
) {
  return <T>(source: import("rxjs").Observable<T>) =>
    source.pipe(
      retryWhen((attempts) =>
        attempts.pipe(
          take(retryAttempts),
          mergeMap((error, index) => {
            const includeError = toRetry(error);
            if (verbose && includeError) {
              console.warn(
                `Attempt ${index + 1}: Retrying in ${
                  retryDelay / 1000
                } seconds...`,
              );
            }
            return includeError ? of(error) : throwError(error);
          }),
          delay(retryDelay),
        ),
      ),
    );
}
