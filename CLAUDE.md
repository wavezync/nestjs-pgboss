# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

`@wavezync/nestjs-pgboss` is a NestJS module that integrates [pg-boss](https://github.com/timgit/pg-boss) for PostgreSQL-based job scheduling and handling. It's published as an npm package.

## Commands

- **Build:** `npm run build` (uses `nest build`)
- **Test:** `npm test` (Jest, tests live in `test/`)
- **Run single test:** `npx jest --testPathPattern=<pattern>`
- **Lint:** `npm run lint` (ESLint with auto-fix)
- **Format:** `npm run format` (Prettier)

## Architecture

Source code is in `lib/` (not `src/`), configured via `nest-cli.json` with `sourceRoot: "lib"`. Output goes to `dist/`.

### Key Components

- **`PgBossModule`** (`lib/pgboss.module.ts`) — Global dynamic NestJS module. Only exposes `forRootAsync()` for async configuration. Manages the PgBoss lifecycle (start on init, stop on destroy) and triggers handler registration at application bootstrap.

- **`PgBossService`** (`lib/pgboss.service.ts`) — Injectable service wrapping the PgBoss instance. Provides `scheduleJob()`, `scheduleCronJob()`, `registerJob()`, and `registerCronJob()`. All methods call `createQueue()` before operating. Exposes raw `boss` getter for direct PgBoss access.

- **`HandlerScannerService`** (`lib/handler-scanner.service.ts`) — Scans all NestJS providers at bootstrap to find methods decorated with `@Job` or `@CronJob`, then registers them as workers via `PgBossService`.

- **Decorators** (`lib/decorators/job.decorator.ts`) — `@Job(name, options?)` and `@CronJob(name, cron, options?)` use `SetMetadata` to attach job metadata to handler methods. Options use pg-boss native `WorkOptions` and `ScheduleOptions` types.

- **Module options** (`lib/interfaces/pgboss-module-options.interface.ts`) — Extends pg-boss `ConstructorOptions` with `retryLimit` and `retryDelay` for connection retry logic.

### Registration Flow

`forRootAsync()` creates PgBoss instance → `onApplicationBootstrap` triggers `HandlerScannerService.scanAndRegisterHandlers()` → scans all module providers for `@Job`/`@CronJob` metadata → registers workers via `PgBossService`.

## Peer Dependencies

Requires `@nestjs/common` ^11, `@nestjs/core` ^11, `pg-boss` >=12.6.0.
