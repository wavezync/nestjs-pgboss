import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PgBossService } from '@wavezync/nestjs-pgboss';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(private readonly boss: PgBossService) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.boss.scheduleJob('say-hello', { name: 'world' });
  }
}
