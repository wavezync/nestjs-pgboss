# `@wavezync/nestjs-pgboss`

<p align="center">
    Use <a href="https://github.com/timgit/pg-boss" target="_blank">pg-boss</a> in your Nest.js app!
<p align="center">

<p align="center">
   <a href="https://github.com/wavezync/nestjs-pgboss/actions/workflows/build.yaml">
        <img src="https://img.shields.io/github/actions/workflow/status/wavezync/nestjs-pgboss/build.yaml?branch=main" alt="Build Status">
    </a>
    <a href="https://www.npmjs.com/package/@wavezync/nestjs-pgboss">
      <img alt="NPM Version" src="https://img.shields.io/npm/v/%40wavezync%2Fnestjs-pgboss">
    </a>
    <a href="https://github.com/wavezync/nestjs-pgboss/blob/main/LICENSE">
        <img src="https://img.shields.io/badge/License-MIT-green" alt="License">
    </a>
</p>

## Installation

```bash
npm install pg-boss @wavezync/nestjs-pgboss
```

## Usage

### Setup

To begin using `@wavezync/nestjs-pgboss`, initialize the root module:

```ts
import { PGBossModule } from "@wavezync/nestjs-pgboss";

// app.module.ts
@Module({
  imports: [
    PgBossModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connectionString: configService.get<string>('DATABASE_URL'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

#### Schedule a job using `PgBossService`

```ts
import { Injectable } from '@nestjs/common';
import { PgBossService } from '@wavezync/nestjs-pgboss';

@Injectable()
export class JobSchedulerService {
  constructor(private readonly pgBossService: PgBossService) {}

  async scheduleJob() {
    await this.pgBossService.scheduleJob('my-job', { key: 'value' });
  }
}

```

#### Access `boss` Directly

You can access the `PgBoss` instance directly via `pgBossService.boss`

#### Handle jobs using the `@Job` decorator

```ts
import { Injectable, Logger } from '@nestjs/common';
import { Job } from '@wavezync/nestjs-pgboss';

@Injectable()
export class MyJobHandler {
  private readonly logger = new Logger(MyJobHandler.name);

  @Job('my-job')
  async handleMyJob(job: { data: any }) {
    this.logger.log('Handling job with data:', job.data);
  }
}

```

#### Handle cron jobs using the `@CronJob` decorator

```ts
import { Injectable, Logger } from '@nestjs/common';
import { PgBossService, CronJob } from '@wavezync/nestjs-pgboss';

@Injectable()
export class MyCronJobService {
  private readonly logger = new Logger(MyCronJobService.name);

  @CronJob('my-cron-job', '0 * * * *', { priority: 1 })
  async handleCron() {
    this.logger.log('Executing cron job: my-cron-job');
  }
}

```

## Test

```bash
# unit tests
$ npm run test

```

## License

`@wavezync/nestjs-pgboss` is [MIT licensed](LICENSE)
