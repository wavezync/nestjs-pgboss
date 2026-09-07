import { Test, TestingModule } from "@nestjs/testing";
import { PgBoss } from "pg-boss";
import type { Mocked } from "vitest";
import { PgBossService } from "../lib/pgboss.service";
import { PGBOSS_TOKEN } from "../lib/utils/consts";

vi.mock("pg-boss", () => {
  return {
    PgBoss: vi.fn().mockImplementation(function PgBossMock() {
      return {
        on: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        send: vi.fn(),
        schedule: vi.fn(),
        work: vi.fn(),
        createQueue: vi.fn(),
      };
    }),
  };
});

describe("PgBossService", () => {
  let service: PgBossService;
  let mockPgBoss: Mocked<PgBoss>;

  beforeEach(async () => {
    mockPgBoss = new PgBoss("connectionString") as Mocked<PgBoss>;
    mockPgBoss.createQueue.mockResolvedValue(undefined);
    mockPgBoss.send.mockResolvedValue("job-id");
    mockPgBoss.schedule.mockResolvedValue(undefined);
    mockPgBoss.work.mockResolvedValue("worker-id");

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PgBossService,
        { provide: PGBOSS_TOKEN, useValue: mockPgBoss },
      ],
    }).compile();

    service = module.get<PgBossService>(PgBossService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("registerJob", () => {
    it("should call PgBoss work with correct parameters", async () => {
      const handler = vi.fn();
      const options = {};

      await service.registerJob("test-job", handler, options);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockPgBoss.work).toHaveBeenCalledWith(
        "test-job",
        { includeMetadata: true },
        handler,
      );
    });

    it("should pass queue options to createQueue", async () => {
      const handler = vi.fn();
      const queueOptions = { retryLimit: 5, retryDelay: 30 };

      await service.registerJob("test-job", handler, {}, queueOptions);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockPgBoss.createQueue).toHaveBeenCalledWith(
        "test-job",
        queueOptions,
      );
    });
  });

  describe("scheduleJob", () => {
    it("should call PgBoss send with correct parameters", async () => {
      const data = { test: "data" };

      await service.scheduleJob("test-job", data, {});

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockPgBoss.send).toHaveBeenCalledWith("test-job", data, {});
    });

    it("should call createQueue before send", async () => {
      const callOrder: string[] = [];
      mockPgBoss.createQueue.mockImplementation(() => {
        callOrder.push("createQueue");
        return Promise.resolve();
      });
      mockPgBoss.send.mockImplementation(() => {
        callOrder.push("send");
        return Promise.resolve("job-id");
      });

      await service.scheduleJob("test-job", {});

      expect(callOrder).toEqual(["createQueue", "send"]);
    });
  });

  describe("scheduleCronJob", () => {
    it("should call createQueue then schedule with correct params", async () => {
      await service.scheduleCronJob(
        "cron-job",
        "0 * * * *",
        { key: "val" },
        { tz: "UTC" },
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockPgBoss.createQueue).toHaveBeenCalledWith("cron-job");
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockPgBoss.schedule).toHaveBeenCalledWith(
        "cron-job",
        "0 * * * *",
        { key: "val" },
        { tz: "UTC" },
      );
    });

    it("should use {} defaults when data/options are omitted", async () => {
      await service.scheduleCronJob("cron-job", "0 * * * *");

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockPgBoss.schedule).toHaveBeenCalledWith(
        "cron-job",
        "0 * * * *",
        {},
        {},
      );
    });
  });

  describe("boss getter", () => {
    it("should return the PgBoss instance", () => {
      expect(service.boss).toBe(mockPgBoss);
    });
  });

  describe("registerCronJob", () => {
    it("should call PgBoss schedule and work with correct parameters", async () => {
      const handler = vi.fn();
      const cron = "* * * * *";
      const data = { test: "data" };
      const options = { tz: "UTC" };

      await service.registerCronJob(
        "test-cron-job",
        cron,
        handler,
        data,
        options,
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockPgBoss.schedule).toHaveBeenCalledWith(
        "test-cron-job",
        cron,
        data,
        { tz: "UTC" },
      );
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockPgBoss.work).toHaveBeenCalledWith(
        "test-cron-job",
        { includeMetadata: true, tz: "UTC" },
        handler,
      );
    });
  });
});
