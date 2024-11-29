import { of, throwError } from "rxjs";
import { mergeMap, retryWhen, delay } from "rxjs/operators";

export function handleRetry(
  retryAttempts = 9,
  retryDelay = 3000,
  toRetry: (err: any) => boolean = (_err: any) => true,
) {
  return <T>(source: import("rxjs").Observable<T>) =>
    source.pipe(
      retryWhen((attempts) =>
        attempts.pipe(
          mergeMap((error, index) => {
            const includeError = toRetry(error);

            if (includeError) {
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
