import { Test, TestingModule } from "@nestjs/testing";
import { PgBoss } from "pg-boss";
import { PgBossService } from "../lib/pgboss.service";
import { PGBOSS_TOKEN } from "../lib/utils/consts";

jest.mock("pg-boss", () => {
  return {
    PgBoss: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      send: jest.fn(),
      schedule: jest.fn(),
      work: jest.fn(),
      createQueue: jest.fn(),
    })),
  };
});

describe("PgBossService", () => {
  let service: PgBossService;
  let mockPgBoss: any;

  beforeEach(async () => {
    mockPgBoss = new PgBoss("connectionString");
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
      const handler = jest.fn();
      const options = {};

      await service.registerJob("test-job", handler, options);

      expect(mockPgBoss.work).toHaveBeenCalledWith(
        "test-job",
        { includeMetadata: true },
        handler,
      );
    });
  });

  describe("scheduleJob", () => {
    it("should call PgBoss send with correct parameters", async () => {
      const data = { test: "data" };

      await service.scheduleJob("test-job", data, {});

      expect(mockPgBoss.send).toHaveBeenCalledWith("test-job", data, {});
    });
  });

  describe("registerCronJob", () => {
    it("should call PgBoss schedule and work with correct parameters", async () => {
      const handler = jest.fn();
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

      expect(mockPgBoss.schedule).toHaveBeenCalledWith(
        "test-cron-job",
        cron,
        data,
        { tz: "UTC" },
      );
      expect(mockPgBoss.work).toHaveBeenCalledWith(
        "test-cron-job",
        { includeMetadata: true, tz: "UTC" },
        handler,
      );
    });
  });
});
