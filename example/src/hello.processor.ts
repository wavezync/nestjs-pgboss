import { Injectable, Logger } from '@nestjs/common';
import { CronJob, Job, PgBossService } from '@wavezync/nestjs-pgboss';
import type { JobWithMetadata } from 'pg-boss';

interface SayHelloData {
  name: string;
}

@Injectable()
export class HelloProcessor {
  private readonly logger = new Logger(HelloProcessor.name);

  constructor(private readonly boss: PgBossService) {}

  @Job('say-hello')
  async handleSayHello(jobs: JobWithMetadata<SayHelloData>[]): Promise<void> {
    for (const job of jobs) {
      this.logger.log(`Hello, ${job.data.name}!`);
    }
  }

  @CronJob('tick', '* * * * *')
  async handleTick(): Promise<void> {
    this.logger.log('Tick - enqueueing a say-hello job');
    await this.boss.scheduleJob('say-hello', { name: 'world' });
  }
}
