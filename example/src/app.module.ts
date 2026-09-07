import { Module } from '@nestjs/common';
import { PgBossModule } from '@wavezync/nestjs-pgboss';
import { AppService } from './app.service.js';
import { HelloProcessor } from './hello.processor.js';

@Module({
  imports: [
    PgBossModule.forRootAsync({
      useFactory: () => ({
        connectionString:
          process.env.DATABASE_URL ??
          'postgres://postgres:postgres@localhost:5432/example',
      }),
    }),
  ],
  providers: [AppService, HelloProcessor],
})
export class AppModule {}
