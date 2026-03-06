jest.mock("pg-boss", () => {
  return {
    PgBoss: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    })),
  };
});

import { PgBossModule } from "../lib/pgboss.module";
import { HandlerScannerService } from "../lib/handler-scanner.service";
import { PgBossService } from "../lib/pgboss.service";
import { PGBOSS_OPTIONS, PGBOSS_TOKEN } from "../lib/utils/consts";
import { MetadataScanner } from "@nestjs/core";

describe("PgBossModule", () => {
  let mockBoss: any;
  let mockHandlerScanner: jest.Mocked<
    Pick<HandlerScannerService, "scanAndRegisterHandlers">
  >;
  let module: PgBossModule;

  beforeEach(() => {
    mockBoss = {
      on: jest.fn(),
      stop: jest.fn().mockResolvedValue(undefined),
    };
    mockHandlerScanner = {
      scanAndRegisterHandlers: jest.fn().mockResolvedValue(undefined),
    };
    module = new PgBossModule(mockBoss, mockHandlerScanner as any);
  });

  it("should register error event listener on boss in constructor", () => {
    expect(mockBoss.on).toHaveBeenCalledWith("error", expect.any(Function));
  });

  describe("onApplicationBootstrap", () => {
    it("should call scanAndRegisterHandlers", async () => {
      await module.onApplicationBootstrap();
      expect(mockHandlerScanner.scanAndRegisterHandlers).toHaveBeenCalled();
    });
  });

  describe("onModuleDestroy", () => {
    it("should call boss.stop()", async () => {
      await module.onModuleDestroy();
      expect(mockBoss.stop).toHaveBeenCalled();
    });

    it("should catch and log errors from boss.stop()", async () => {
      mockBoss.stop.mockRejectedValue(new Error("stop failed"));
      // Should not throw
      await expect(module.onModuleDestroy()).resolves.not.toThrow();
    });
  });

  describe("forRootAsync", () => {
    it("should return correct module structure with useFactory", () => {
      const factory = jest.fn();
      const result = PgBossModule.forRootAsync({
        useFactory: factory,
        inject: ["CONFIG"],
      });

      expect(result.module).toBe(PgBossModule);
      expect(result.exports).toContain(PgBossService);
      expect(result.exports).toContain(PGBOSS_TOKEN);

      const providerTokens = (result.providers as any[]).map(
        (p: any) => p.provide || p,
      );
      expect(providerTokens).toContain(PGBOSS_OPTIONS);
      expect(providerTokens).toContain(PGBOSS_TOKEN);
      expect(providerTokens).toContain(PgBossService);
      expect(providerTokens).toContain(HandlerScannerService);
      expect(providerTokens).toContain(MetadataScanner);
    });

    it("should return correct module structure with useClass", () => {
      class TestOptionsFactory {
        createPgBossOptions() {
          return { connectionString: "postgres://localhost/test" };
        }
      }

      const result = PgBossModule.forRootAsync({
        useClass: TestOptionsFactory,
      });

      expect(result.module).toBe(PgBossModule);
      expect(result.exports).toContain(PgBossService);
      expect(result.exports).toContain(PGBOSS_TOKEN);

      const providerTokens = (result.providers as any[]).map(
        (p: any) => p.provide || p,
      );
      expect(providerTokens).toContain(PGBOSS_OPTIONS);
      expect(providerTokens).toContain(PGBOSS_TOKEN);
      // useClass also adds the class itself as a provider
      expect(providerTokens).toContain(TestOptionsFactory);
    });

    it("should pass imports through", () => {
      const fakeModule = { module: class FakeModule {} } as any;
      const result = PgBossModule.forRootAsync({
        imports: [fakeModule],
        useFactory: jest.fn(),
      });

      expect(result.imports).toContain(fakeModule);
    });

    it("should default imports to empty array", () => {
      const result = PgBossModule.forRootAsync({
        useFactory: jest.fn(),
      });

      expect(result.imports).toEqual([]);
    });
  });
});
