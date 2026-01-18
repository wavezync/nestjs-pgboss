jest.mock("pg-boss", () => ({}));

import { Test, TestingModule } from "@nestjs/testing";
import { Reflector, ModulesContainer } from "@nestjs/core";
import { HandlerScannerService } from "../lib/handler-scanner.service";
import { PgBossService } from "../lib/pgboss.service";
import { JOB_NAME, JOB_OPTIONS } from "../lib/decorators/job.decorator";

describe("HandlerScannerService", () => {
  let service: HandlerScannerService;
  let mockPgBossService: any;
  let mockReflector: any;
  let mockModulesContainer: Map<string, any>;

  class TestHandler {
    handle() {}
  }

  beforeEach(async () => {
    mockPgBossService = {
      registerJob: jest.fn().mockResolvedValue(undefined),
      registerCronJob: jest.fn().mockResolvedValue(undefined),
    };

    mockReflector = { get: jest.fn() };
    mockModulesContainer = new Map();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandlerScannerService,
        { provide: PgBossService, useValue: mockPgBossService },
        { provide: Reflector, useValue: mockReflector },
        { provide: ModulesContainer, useValue: mockModulesContainer },
      ],
    }).compile();

    service = module.get<HandlerScannerService>(HandlerScannerService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("teamSize", () => {
    const setupHandler = (jobOptions?: { teamSize?: number }) => {
      const instance = new TestHandler();
      mockModulesContainer.set("TestModule", {
        providers: new Map([["TestHandler", { instance }]]),
      });
      mockReflector.get.mockImplementation((key: string, target: any) => {
        if (key === JOB_NAME && target === instance.handle) return "my-job";
        if (key === JOB_OPTIONS && target === instance.handle) return jobOptions;
        return undefined;
      });
    };

    it("should register job once by default", async () => {
      setupHandler();
      await service.scanAndRegisterHandlers();
      expect(mockPgBossService.registerJob).toHaveBeenCalledTimes(1);
    });

    it("should register job multiple times when teamSize > 1", async () => {
      setupHandler({ teamSize: 3 });
      await service.scanAndRegisterHandlers();
      expect(mockPgBossService.registerJob).toHaveBeenCalledTimes(3);
    });

    it("should default to 1 when teamSize is 0", async () => {
      setupHandler({ teamSize: 0 });
      await service.scanAndRegisterHandlers();
      expect(mockPgBossService.registerJob).toHaveBeenCalledTimes(1);
    });

    it("should default to 1 when teamSize is negative", async () => {
      setupHandler({ teamSize: -5 });
      await service.scanAndRegisterHandlers();
      expect(mockPgBossService.registerJob).toHaveBeenCalledTimes(1);
    });
  });
});
