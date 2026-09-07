import type { Mocked } from "vitest";

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

import { Test, TestingModule } from "@nestjs/testing";
import { Reflector, ModulesContainer } from "@nestjs/core";
import { HandlerScannerService } from "../lib/handler-scanner.service";
import { PgBossService } from "../lib/pgboss.service";
import {
  JOB_NAME,
  JOB_OPTIONS,
  QUEUE_OPTIONS,
  CRON_EXPRESSION,
  CRON_OPTIONS,
} from "../lib/decorators/job.decorator";

describe("HandlerScannerService", () => {
  let scanner: HandlerScannerService;
  let pgBossService: Mocked<
    Pick<PgBossService, "registerJob" | "registerCronJob">
  >;
  let reflector: Reflector;
  let modulesContainer: ModulesContainer;

  beforeEach(async () => {
    pgBossService = {
      registerJob: vi.fn().mockResolvedValue(undefined),
      registerCronJob: vi.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandlerScannerService,
        { provide: PgBossService, useValue: pgBossService },
        Reflector,
        { provide: ModulesContainer, useValue: new Map() },
      ],
    }).compile();

    scanner = module.get<HandlerScannerService>(HandlerScannerService);
    reflector = module.get<Reflector>(Reflector);
    modulesContainer = module.get<ModulesContainer>(ModulesContainer);
  });

  it("should be defined", () => {
    expect(scanner).toBeDefined();
  });

  it("should register @Job-decorated methods via registerJob", async () => {
    const handler = vi.fn();
    const instance = {
      handle: handler,
    };
    Object.setPrototypeOf(
      instance,
      Object.create(null, {
        constructor: { value: class {} },
        handle: { value: handler, enumerable: true },
      }) as object,
    );

    const reflectorGetSpy = vi.spyOn(reflector, "get");
    reflectorGetSpy.mockImplementation((key: any, target: any) => {
      if (target === handler) {
        if (key === JOB_NAME) return "test-job";
        if (key === JOB_OPTIONS) return { teamSize: 2 };
      }
      return undefined;
    });

    const fakeModule = {
      providers: new Map([
        [
          "TestProvider",
          {
            instance,
            metatype: class {},
          },
        ],
      ]),
    };
    (modulesContainer as Map<string, any>).set("TestModule", fakeModule);

    await scanner.scanAndRegisterHandlers();

    expect(pgBossService.registerJob).toHaveBeenCalledWith(
      "test-job",
      expect.any(Function),
      { teamSize: 2 },
      undefined,
    );
  });

  it("should pass QUEUE_OPTIONS metadata to registerJob", async () => {
    const handler = vi.fn();
    const instance = {
      handle: handler,
    };
    Object.setPrototypeOf(
      instance,
      Object.create(null, {
        constructor: { value: class {} },
        handle: { value: handler, enumerable: true },
      }) as object,
    );

    const reflectorGetSpy = vi.spyOn(reflector, "get");
    reflectorGetSpy.mockImplementation((key: any, target: any) => {
      if (target === handler) {
        if (key === JOB_NAME) return "queue-job";
        if (key === JOB_OPTIONS) return {};
        if (key === QUEUE_OPTIONS) return { retryLimit: 5 };
      }
      return undefined;
    });

    const fakeModule = {
      providers: new Map([
        [
          "TestProvider",
          {
            instance,
            metatype: class {},
          },
        ],
      ]),
    };
    (modulesContainer as Map<string, any>).set("TestModule", fakeModule);

    await scanner.scanAndRegisterHandlers();

    expect(pgBossService.registerJob).toHaveBeenCalledWith(
      "queue-job",
      expect.any(Function),
      {},
      { retryLimit: 5 },
    );
  });

  it("should register @CronJob-decorated methods via registerCronJob", async () => {
    const handler = vi.fn();
    const instance = {
      handle: handler,
    };
    Object.setPrototypeOf(
      instance,
      Object.create(null, {
        constructor: { value: class {} },
        handle: { value: handler, enumerable: true },
      }) as object,
    );

    const reflectorGetSpy = vi.spyOn(reflector, "get");
    reflectorGetSpy.mockImplementation((key: any, target: any) => {
      if (target === handler) {
        if (key === JOB_NAME) return "cron-job";
        if (key === CRON_EXPRESSION) return "* * * * *";
        if (key === CRON_OPTIONS) return { tz: "UTC" };
      }
      return undefined;
    });

    const fakeModule = {
      providers: new Map([
        [
          "TestProvider",
          {
            instance,
            metatype: class {},
          },
        ],
      ]),
    };
    (modulesContainer as Map<string, any>).set("TestModule", fakeModule);

    await scanner.scanAndRegisterHandlers();

    expect(pgBossService.registerCronJob).toHaveBeenCalledWith(
      "cron-job",
      "* * * * *",
      expect.any(Function),
      {},
      { tz: "UTC" },
    );
  });

  it("should skip providers with no instance", async () => {
    const fakeModule = {
      providers: new Map([
        ["NullProvider", { instance: null, metatype: class {} }],
      ]),
    };
    (modulesContainer as Map<string, any>).set("TestModule", fakeModule);

    await scanner.scanAndRegisterHandlers();

    expect(pgBossService.registerJob).not.toHaveBeenCalled();
    expect(pgBossService.registerCronJob).not.toHaveBeenCalled();
  });

  it("should skip methods without job metadata", async () => {
    const instance = {
      someMethod: vi.fn(),
    };
    Object.setPrototypeOf(
      instance,
      Object.create(null, {
        constructor: { value: class {} },
        someMethod: { value: vi.fn(), enumerable: true },
      }) as object,
    );

    vi.spyOn(reflector, "get").mockReturnValue(undefined);

    const fakeModule = {
      providers: new Map([["TestProvider", { instance, metatype: class {} }]]),
    };
    (modulesContainer as Map<string, any>).set("TestModule", fakeModule);

    await scanner.scanAndRegisterHandlers();

    expect(pgBossService.registerJob).not.toHaveBeenCalled();
    expect(pgBossService.registerCronJob).not.toHaveBeenCalled();
  });

  it("should log errors when registration fails", async () => {
    const handler = vi.fn();
    const instance = {
      handle: handler,
    };
    Object.setPrototypeOf(
      instance,
      Object.create(null, {
        constructor: { value: class {} },
        handle: { value: handler, enumerable: true },
      }) as object,
    );

    vi.spyOn(reflector, "get").mockImplementation((key: any, target: any) => {
      if (target === handler) {
        if (key === JOB_NAME) return "failing-job";
        if (key === JOB_OPTIONS) return {};
      }
      return undefined;
    });

    pgBossService.registerJob.mockRejectedValue(
      new Error("registration failed"),
    );

    const fakeModule = {
      providers: new Map([["TestProvider", { instance, metatype: class {} }]]),
    };
    (modulesContainer as Map<string, any>).set("TestModule", fakeModule);

    // Should not throw
    await expect(scanner.scanAndRegisterHandlers()).resolves.not.toThrow();
  });

  it("should bind handler to the correct instance context", async () => {
    const handler = vi.fn();
    const instance = {
      handle: handler,
    };
    Object.setPrototypeOf(
      instance,
      Object.create(null, {
        constructor: { value: class {} },
        handle: { value: handler, enumerable: true },
      }) as object,
    );

    vi.spyOn(reflector, "get").mockImplementation((key: any, target: any) => {
      if (target === handler) {
        if (key === JOB_NAME) return "bound-job";
        if (key === JOB_OPTIONS) return {};
      }
      return undefined;
    });

    const fakeModule = {
      providers: new Map([["TestProvider", { instance, metatype: class {} }]]),
    };
    (modulesContainer as Map<string, any>).set("TestModule", fakeModule);

    await scanner.scanAndRegisterHandlers();

    // The handler passed to registerJob should be bound to the instance
    const boundHandler = pgBossService.registerJob.mock.calls[0][1];
    expect(typeof boundHandler).toBe("function");
  });

  it("should skip prototype getters that throw (e.g. TypeORM DataSource.mongoManager)", async () => {
    const proto = Object.create(null) as object;
    Object.defineProperty(proto, "constructor", { value: class {} });
    Object.defineProperty(proto, "mongoManager", {
      get() {
        throw new Error(
          "MongoEntityManager is only available for MongoDB databases.",
        );
      },
      enumerable: true,
    });
    Object.defineProperty(proto, "handle", {
      value: vi.fn(),
      enumerable: true,
    });

    const instance = Object.create(proto) as object;

    vi.spyOn(reflector, "get").mockReturnValue(undefined);

    const fakeModule = {
      providers: new Map([["TestProvider", { instance, metatype: class {} }]]),
    };
    (modulesContainer as Map<string, any>).set("TestModule", fakeModule);

    // Should not throw despite the getter
    await expect(scanner.scanAndRegisterHandlers()).resolves.not.toThrow();
  });
});
