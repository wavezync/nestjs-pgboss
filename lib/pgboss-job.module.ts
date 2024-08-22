import { Module } from "@nestjs/common";

/**
 * Only used because `PgBossModule.forJobs()` returns a dynamic module that
 * needs a module reference. Using `PgBossModule` does not work, as that one
 * would initialize a second pg-boss instance.
 */
@Module({})
export class PgBossJobModule {}
