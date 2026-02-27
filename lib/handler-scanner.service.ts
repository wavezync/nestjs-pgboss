import { Injectable, Logger } from "@nestjs/common";
import { Reflector, ModulesContainer } from "@nestjs/core";
import { PgBossService } from "./pgboss.service";
import {
  JOB_NAME,
  JOB_OPTIONS,
  CRON_EXPRESSION,
  CRON_OPTIONS,
} from "./decorators/job.decorator";
import { InstanceWrapper } from "@nestjs/core/injector/instance-wrapper";
import PgBoss from "pg-boss";
import { LOGGER } from "./utils/consts";
import { WorkOptions } from "pg-boss";

@Injectable()
export class HandlerScannerService {
  private readonly logger = new Logger(LOGGER);

  constructor(
    private readonly pgBossService: PgBossService,
    private readonly reflector: Reflector,
    private readonly modulesContainer: ModulesContainer,
  ) {}

  async scanAndRegisterHandlers() {
    for (const module of this.modulesContainer.values()) {
      const providers = [...module.providers.values()];

      for (const provider of providers) {
        await this.scanProvider(provider);
      }
    }
  }

  private async scanProvider(provider: InstanceWrapper<any>) {
    const { instance } = provider;
    if (!instance || typeof instance !== "object") return;

    const prototype = Object.getPrototypeOf(instance);
    const methodNames = Object.getOwnPropertyNames(prototype).filter(
      (method) =>
        method !== "constructor" && typeof instance[method] === "function",
    );

    for (const methodName of methodNames) {
      const methodRef = instance[methodName];

      const jobName = this.reflector.get<string>(JOB_NAME, methodRef);
      const jobOptions = this.reflector.get<WorkOptions>(
        JOB_OPTIONS,
        methodRef,
      );
      const cronExpression = this.reflector.get<string>(
        CRON_EXPRESSION,
        methodRef,
      );
      const cronOptions = this.reflector.get<PgBoss.ScheduleOptions>(
        CRON_OPTIONS,
        methodRef,
      );

      if (jobName) {
        try {
          if (cronExpression) {
            await this.pgBossService.registerCronJob(
              jobName,
              cronExpression,
              methodRef.bind(instance),
              {},
              cronOptions,
            );
            this.logger.log(`Registered cron job: ${jobName}`);
            continue;
          }

          await this.pgBossService.registerJob(
            jobName,
            methodRef.bind(instance),
            jobOptions,
          );

          this.logger.log(`Registered job: ${jobName}`);
        } catch (error) {
          this.logger.error(error, `Error registering job ${jobName}`);
        }
      }
    }
  }
}
