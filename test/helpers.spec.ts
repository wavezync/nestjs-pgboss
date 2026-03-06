import { transformOptions, normalizeJob } from "../lib/utils/helpers";

describe("transformOptions", () => {
  it("should return {} when options is undefined", () => {
    expect(transformOptions(undefined)).toEqual({});
  });

  it("should spread options through unchanged when no priority", () => {
    const options = { tz: "UTC" };
    expect(transformOptions(options)).toEqual({ tz: "UTC" });
  });

  it("should convert numeric priority > 0 to true", () => {
    const options = { priority: 5 } as any;
    expect(transformOptions(options)).toEqual({ priority: true });
  });

  it("should convert numeric priority <= 0 to false", () => {
    expect(transformOptions({ priority: 0 } as any)).toEqual({
      priority: false,
    });
    expect(transformOptions({ priority: -1 } as any)).toEqual({
      priority: false,
    });
  });
});

describe("normalizeJob", () => {
  it('should return the "0" property from array-like objects', () => {
    const job = { "0": { id: "job-1", data: {} } };
    expect(normalizeJob(job)).toEqual({ id: "job-1", data: {} });
  });

  it("should return the job as-is for plain objects", () => {
    const job = { id: "job-1", data: {} };
    expect(normalizeJob(job)).toEqual({ id: "job-1", data: {} });
  });

  it("should return primitives unchanged", () => {
    expect(normalizeJob("test")).toBe("test");
    expect(normalizeJob(42)).toBe(42);
  });

  it("should handle null input", () => {
    expect(normalizeJob(null)).toBeNull();
  });
});
