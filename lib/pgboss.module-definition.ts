import { ConfigurableModuleBuilder } from "@nestjs/common";
import { PgBossModuleOptions } from "./interfaces/pgboss-module-options.interface";

export const { ConfigurableModuleClass, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<PgBossModuleOptions>({
    optionsInjectionToken: Symbol("MODULE_OPTIONS_TOKEN"),
  })
    .setClassMethodName("forRoot")
    .setFactoryMethodName("createPgBossOptions")
    .setExtras({ isGlobal: true }, (definition, extras) => {
      if (extras.isGlobal) {
        return {
          global: true,
          ...definition,
        };
      }
      return definition;
    })
    .build();
