import { ModuleMetadata, Type } from "@nestjs/common";
import { ConstructorOptions } from "pg-boss";

export type PgBossModuleOptions = ConstructorOptions;

export interface PgBossOptionsFactory {
  createPgBossOptions(): Promise<PgBossModuleOptions> | PgBossModuleOptions;
}

export interface PgBossModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  useExisting?: Type<PgBossOptionsFactory>;
  useClass?: Type<PgBossOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<PgBossModuleOptions> | PgBossModuleOptions;
  inject?: any[];
}
