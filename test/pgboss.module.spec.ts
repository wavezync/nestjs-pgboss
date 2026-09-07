import type { Mock, Mocked } from "vitest";
import type { DynamicModule } from "@nestjs/common";
import type { PgBoss } from "pg-boss";

vi.mock("pg-boss", () => {
  return {
    PgBoss: vi.fn().mockImplementation(function PgBossMock() {
      return {
        on: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
      };
    }),
  };
});

import { PgBossModule } from "../lib/pgboss.module";
import { HandlerScannerService } from "../lib/handler-scanner.service";
import { PgBossService } from "../lib/pgboss.service";
import { PGBOSS_OPTIONS, PGBOSS_TOKEN } from "../lib/utils/consts";
import { MetadataScanner } from "@nestjs/core";

type MockBoss = { on: Mock; stop: Mock };

describe("PgBossModule", () => {
  let mockBoss: MockBoss;
  let mockHandlerScanner: Mocked<
    Pick<HandlerScannerService, "scanAndRegisterHandlers">
  >;
  let module: PgBossModule;

  beforeEach(() => {
    mockBoss = {
      on: vi.fn(),
      stop: vi.fn().mockResolvedValue(undefined),
    };
    mockHandlerScanner = {
      scanAndRegisterHandlers: vi.fn().mockResolvedValue(undefined),
    };
    module = new PgBossModule(
      mockBoss as unknown as PgBoss,
      mockHandlerScanner as unknown as HandlerScannerService,
    );
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
      const factory = vi.fn();
      const result = PgBossModule.forRootAsync({
        useFactory: factory,
        inject: ["CONFIG"],
      });

      expect(result.module).toBe(PgBossModule);
      expect(result.exports).toContain(PgBossService);
      expect(result.exports).toContain(PGBOSS_TOKEN);

      const providerTokens = result.providers.map((p) =>
        "provide" in p ? p.provide : p,
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

      const providerTokens = result.providers.map((p) =>
        "provide" in p ? p.provide : p,
      );
      expect(providerTokens).toContain(PGBOSS_OPTIONS);
      expect(providerTokens).toContain(PGBOSS_TOKEN);
      // useClass also adds the class itself as a provider
      expect(providerTokens).toContain(TestOptionsFactory);
    });

    it("should pass imports through", () => {
      const fakeModule: DynamicModule = { module: class FakeModule {} };
      const result = PgBossModule.forRootAsync({
        imports: [fakeModule],
        useFactory: vi.fn(),
      });

      expect(result.imports).toContain(fakeModule);
    });

    it("should default imports to empty array", () => {
      const result = PgBossModule.forRootAsync({
        useFactory: vi.fn(),
      });

      expect(result.imports).toEqual([]);
    });
  });
});
