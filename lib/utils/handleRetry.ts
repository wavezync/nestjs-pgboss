import { of, throwError } from "rxjs";
import { mergeMap, retryWhen, delay } from "rxjs/operators";

export function handleRetry(
  retryAttempts = 9,
  retryDelay = 3000,
  toRetry: (err: unknown) => boolean = () => true,
) {
  return <T>(source: import("rxjs").Observable<T>) =>
    source.pipe(
      retryWhen((attempts) =>
        attempts.pipe(
          mergeMap((error: unknown, index: number) => {
            const includeError = toRetry(error);

            if (includeError) {
              if (index + 1 >= retryAttempts) {
                const message =
                  error instanceof Error ? error.message : "Unknown error";
                return throwError(() => new Error(message));
              }

              return of(error).pipe(delay(retryDelay));
            }

            return throwError(() => error as Error);
          }),
        ),
      ),
    );
}
