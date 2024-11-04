import { of, throwError } from "rxjs";
import { mergeMap, retryWhen, delay } from "rxjs/operators";
import { LOGGER } from "./consts";
import { Logger } from "@nestjs/common";

export function handleRetry(
  retryAttempts = 9,
  retryDelay = 3000,
  verbose = false,
  toRetry: (err: any) => boolean = (_err: any) => true,
) {
  const logger = new Logger(LOGGER);

  return <T>(source: import("rxjs").Observable<T>) =>
    source.pipe(
      retryWhen((attempts) =>
        attempts.pipe(
          mergeMap((error, index) => {
            const includeError = toRetry(error);

            if (includeError) {
              if (verbose) {
                logger.warn(
                  `Attempt ${index + 1}: Retrying in ${
                    retryDelay / 1000
                  } seconds...`,
                );
              }

              if (index + 1 >= retryAttempts) {
                return throwError(() => new Error(error.message));
              }

              return of(error).pipe(delay(retryDelay));
            }

            return throwError(() => error);
          }),
        ),
      ),
    );
}
