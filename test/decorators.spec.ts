import "reflect-metadata";
import {
  Job,
  CronJob,
  JOB_NAME,
  JOB_OPTIONS,
  CRON_EXPRESSION,
  CRON_OPTIONS,
  PG_BOSS_JOB_METADATA,
} from "../lib/decorators/job.decorator";

/* eslint-disable @typescript-eslint/unbound-method */
describe("Job Decorator", () => {
  it("should set JOB_NAME, JOB_OPTIONS, and PG_BOSS_JOB_METADATA with defaults", () => {
    class TestClass {
      @Job("test-job")
      handle() {}
    }

    const method = TestClass.prototype.handle;

    expect(Reflect.getMetadata(JOB_NAME, method)).toBe("test-job");
    expect(Reflect.getMetadata(JOB_OPTIONS, method)).toEqual({});
    expect(Reflect.getMetadata(PG_BOSS_JOB_METADATA, method)).toEqual({
      jobName: "test-job",
      workOptions: {},
    });
  });

  it("should pass custom WorkOptions through", () => {
    const options = { teamSize: 5, teamConcurrency: 2 } as any;

    class TestClass {
      @Job("custom-job", options)
      handle() {}
    }

    const method = TestClass.prototype.handle;

    expect(Reflect.getMetadata(JOB_OPTIONS, method)).toEqual(options);
    expect(Reflect.getMetadata(PG_BOSS_JOB_METADATA, method)).toEqual({
      jobName: "custom-job",
      workOptions: options,
    });
  });
});

describe("CronJob Decorator", () => {
  it("should set JOB_NAME, CRON_EXPRESSION, CRON_OPTIONS, and PG_BOSS_JOB_METADATA with defaults", () => {
    class TestClass {
      @CronJob("cron-job", "* * * * *")
      handle() {}
    }

    const method = TestClass.prototype.handle;

    expect(Reflect.getMetadata(JOB_NAME, method)).toBe("cron-job");
    expect(Reflect.getMetadata(CRON_EXPRESSION, method)).toBe("* * * * *");
    expect(Reflect.getMetadata(CRON_OPTIONS, method)).toEqual({});
    expect(Reflect.getMetadata(PG_BOSS_JOB_METADATA, method)).toEqual({
      jobName: "cron-job",
      workOptions: {},
    });
  });

  it("should pass custom ScheduleOptions through", () => {
    const options = { tz: "America/New_York" };

    class TestClass {
      @CronJob("cron-custom", "0 9 * * *", options)
      handle() {}
    }

    const method = TestClass.prototype.handle;

    expect(Reflect.getMetadata(CRON_OPTIONS, method)).toEqual(options);
    expect(Reflect.getMetadata(PG_BOSS_JOB_METADATA, method)).toEqual({
      jobName: "cron-custom",
      workOptions: options,
    });
  });
});
