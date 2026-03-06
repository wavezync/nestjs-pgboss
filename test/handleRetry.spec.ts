import { Observable, of, lastValueFrom } from "rxjs";
import { handleRetry } from "../lib/utils/handleRetry";

describe("handleRetry", () => {
  it("should pass through successful values without retrying", async () => {
    const result = await lastValueFrom(of("success").pipe(handleRetry()));
    expect(result).toBe("success");
  });

  it("should retry on error and eventually succeed", async () => {
    let attempt = 0;
    const source$ = new Observable<string>((subscriber) => {
      attempt++;
      if (attempt < 3) {
        subscriber.error(new Error("fail"));
      } else {
        subscriber.next("success");
        subscriber.complete();
      }
    });

    const result = await lastValueFrom(source$.pipe(handleRetry(5, 1)));
    expect(result).toBe("success");
    expect(attempt).toBe(3);
  });

  it("should throw after exhausting retry attempts", async () => {
    const source$ = new Observable<string>((subscriber) => {
      subscriber.error(new Error("persistent failure"));
    });

    await expect(
      lastValueFrom(source$.pipe(handleRetry(3, 1))),
    ).rejects.toThrow("persistent failure");
  });

  it("should respect custom retryAttempts count", async () => {
    let attempts = 0;
    const source$ = new Observable<string>((subscriber) => {
      attempts++;
      subscriber.error(new Error("fail"));
    });

    await expect(
      lastValueFrom(source$.pipe(handleRetry(2, 1))),
    ).rejects.toThrow("fail");
    expect(attempts).toBe(2);
  });

  it("should throw immediately when toRetry predicate returns false", async () => {
    const source$ = new Observable<string>((subscriber) => {
      subscriber.error(new Error("not retryable"));
    });

    await expect(
      lastValueFrom(source$.pipe(handleRetry(5, 1, () => false))),
    ).rejects.toThrow("not retryable");
  });

  it('should use "Unknown error" for non-Error throws', async () => {
    const source$ = new Observable<string>((subscriber) => {
      subscriber.error("string error");
    });

    await expect(
      lastValueFrom(source$.pipe(handleRetry(1, 1))),
    ).rejects.toThrow("Unknown error");
  });
});
