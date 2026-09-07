# Dead-simple @wavezync/nestjs-pgboss example

Shows only the essentials: module setup, `@Job`, `@CronJob`, and `scheduleJob`.

- `src/app.module.ts` — `PgBossModule.forRootAsync` with a `DATABASE_URL` connection string.
- `src/hello.processor.ts` — `@Job('say-hello')` handler plus `@CronJob('tick', '* * * * *')` that enqueues a `say-hello` job every minute.
- `src/app.service.ts` — sends one `say-hello` job on boot so you see output immediately.

## Run

Requires Postgres (pg-boss has no in-memory mode).

```bash
# From the repo root, build and pack the library first:
npm install
npm run build
npm pack
mv wavezync-nestjs-pgboss-*.tgz local-package.tgz
# Then in example/ (uses file:../local-package.tgz, so reinstall to pick up lib changes):
cp .env.example .env
npm install
npm run start
```

Watch the logs: `Hello, world!` on boot, then a `Tick` + `Hello, world!` every minute.
