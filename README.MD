# `@wavezync/nestjs-pgboss`

<p align="center">
    Use <a href="https://github.com/timgit/pg-boss" target="_blank">pg-boss</a> in your Nest.js service!
<p align="center">

## Installation

```bash
npm install @wavezync/nestjs-pgboss
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

## Test

```bash
# unit tests
$ npm run test

```

## License

`@wavezync/nestjs-pgboss` is [MIT licensed](LICENSE).