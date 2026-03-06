# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Features

- Use pg-boss native WorkOptions instead of internal wrapper ([28671a3](https://github.com/wavezync/nestjs-pgboss/commit/28671a37cd77cca56d04e326b07d006f953f54d4))

### Miscellaneous Tasks

- Bump version to 5.2.0 ([acb1cee](https://github.com/wavezync/nestjs-pgboss/commit/acb1ceefed3206ac57d9cf407e74401d17d42bd0))
## [5.1.1] - 2026-01-31

### Miscellaneous Tasks

- Bump v5.1.1 ([c5164e9](https://github.com/wavezync/nestjs-pgboss/commit/c5164e9cb174b3017646d0441aaf1941acb90091))
## [5.1.0] - 2026-01-18

### Features

- Add teamSize option for parallel job processing ([3e1f02b](https://github.com/wavezync/nestjs-pgboss/commit/3e1f02b7d5db78ced41966810699bcaec21a0f7a))

### Miscellaneous Tasks

- Bump version to 5.1.0 ([fc0a1cc](https://github.com/wavezync/nestjs-pgboss/commit/fc0a1cc5f6d3a3fcdb9ee510b5461203af3d1f63))
## [5.0.0] - 2026-01-05

### Miscellaneous Tasks

- Update dependencies to NestJS 11 and pg-boss 12 ([f229ee2](https://github.com/wavezync/nestjs-pgboss/commit/f229ee218dddfbac13373c1eadfe3701e44d809f))
- Bump version to 5.0.0 ([d980e11](https://github.com/wavezync/nestjs-pgboss/commit/d980e113976354288f5f805111fcd16e31bc84f2))
## [4.0.1] - 2024-11-29

### Features

- Full support for PgBoss ConstructorOptions ([f0725c8](https://github.com/wavezync/nestjs-pgboss/commit/f0725c813bbd0ece4df61810033b11386a9b7fec))

### Miscellaneous Tasks

- Update README example with typed job data ([827c4c7](https://github.com/wavezync/nestjs-pgboss/commit/827c4c78dd3eea568b8d704db7e179fa8ad437bd))
- Bump version to v4.0.1 ([db797b8](https://github.com/wavezync/nestjs-pgboss/commit/db797b807c1000e7308418e5d7a497e87b50e949))
## [4.0.0] - 2024-11-25

### Bug Fixes

- Receive job arrays ([49e78bf](https://github.com/wavezync/nestjs-pgboss/commit/49e78bfcdfad205d764da7792d3563b6f4a9c38f))
- Update readme ([e1ea088](https://github.com/wavezync/nestjs-pgboss/commit/e1ea088d15c9f4f7c50ff5b67466f779c9c1ba0d))
- Update error log ([cb02c06](https://github.com/wavezync/nestjs-pgboss/commit/cb02c063b23c2ee2aacdcb2af2cc927ae8e735ec))

### Features

- Work decorator with Batch Processing ([067076a](https://github.com/wavezync/nestjs-pgboss/commit/067076aa2ade246c782d03ee82a85db38ae2e558))

### Miscellaneous Tasks

- Bump version to v4.0.0 ([3cb7fbc](https://github.com/wavezync/nestjs-pgboss/commit/3cb7fbce3756584072608b6689e5ca8582aba7b1))
## [3.0.1] - 2024-11-04

### Bug Fixes

- Pg-boss startup errors hidden issue ([3caeddf](https://github.com/wavezync/nestjs-pgboss/commit/3caeddf057218c2eda1827e67a9ec1f21985df71))

### Miscellaneous Tasks

- Bump version to v3.0.1 ([42bc9a1](https://github.com/wavezync/nestjs-pgboss/commit/42bc9a17634be9f4d7a5657cae8a8ed620ecddfd))
## [3.0.0] - 2024-09-10

### Bug Fixes

- Ensure queue exists added ([cfb929d](https://github.com/wavezync/nestjs-pgboss/commit/cfb929d2f17ec347b8e251e54c0c8a5a4bd1aa4c))
- Update helpers ([393cd73](https://github.com/wavezync/nestjs-pgboss/commit/393cd735659d904e6271c31de829a4977f4eda07))
- Remove ensureQueueExists ([5939862](https://github.com/wavezync/nestjs-pgboss/commit/5939862e394572541f155e3c82f20f47b54c77d4))

### Features

- Migrate to pgboss 10 ([a115473](https://github.com/wavezync/nestjs-pgboss/commit/a1154735da749ce2f393b1ecaca29cfc08343f68))

### Miscellaneous Tasks

- Bump version to v3.0.0 ([45b9b2b](https://github.com/wavezync/nestjs-pgboss/commit/45b9b2b096bad6a3abae8487b8ee90b05885dbb1))
## [2.2.0] - 2024-09-08

### Bug Fixes

- Getter for boss instance added ([6ebd140](https://github.com/wavezync/nestjs-pgboss/commit/6ebd1400edd48b75106dad4aa317e4f8236588d6))

### Features

- Direct access to pgboss added ([0c9badf](https://github.com/wavezync/nestjs-pgboss/commit/0c9badf2166351fcba579a8ca098d1a6a63d4bd3))

### Miscellaneous Tasks

- Bump version to v2.2.0 ([04c0897](https://github.com/wavezync/nestjs-pgboss/commit/04c0897c548aba46006daf21fc6cae2287c9d8b3))
## [2.1.0] - 2024-08-30

### Bug Fixes

- Use WorkWithMetadataHandler ([1526515](https://github.com/wavezync/nestjs-pgboss/commit/1526515e70d21b03ee215c955aeb7767bb979c11))

### Miscellaneous Tasks

- Clean code ([eaf2322](https://github.com/wavezync/nestjs-pgboss/commit/eaf23220019cac3da03b942175a6c4ef6fad0ac9))
- Bump version to v2.1.0 ([fd0dde3](https://github.com/wavezync/nestjs-pgboss/commit/fd0dde3526094762536377897481d3f286f82552))
## [2.0.1] - 2024-08-30

### Bug Fixes

- Pgboss module error handling ([f69d60c](https://github.com/wavezync/nestjs-pgboss/commit/f69d60c110e7c5324855cf7744a7755512673f8a))
- Handler scanner error handling ([8b80784](https://github.com/wavezync/nestjs-pgboss/commit/8b807845bc317222b938ce710d14a631d2582b0e))

### Miscellaneous Tasks

- Bump version to 2.0.1 ([fcadeb9](https://github.com/wavezync/nestjs-pgboss/commit/fcadeb9ba9535f0782de81701a12a1c36ab20e89))
## [2.0.0] - 2024-08-22

### Bug Fixes

- Use registerJobHandler ([140bb11](https://github.com/wavezync/nestjs-pgboss/commit/140bb11bed5dd30652f760d270a83994495d4ce6))
- Register jobs with handler scanner ([105ae6a](https://github.com/wavezync/nestjs-pgboss/commit/105ae6a0a7f687179bf3e019ab28d3cbf2d836b7))
- Cleanup code ([ef3b53b](https://github.com/wavezync/nestjs-pgboss/commit/ef3b53b397ad062f1f88a04bc250b088e51605c1))
- Update readme ([8aeb18d](https://github.com/wavezync/nestjs-pgboss/commit/8aeb18da0349b3ff97af34b3bce476744c011f1e))

### Documentation

- Update readme ([38533a2](https://github.com/wavezync/nestjs-pgboss/commit/38533a2fecf8aea933c7499bdd51a3200e06ee68))
## [1.0.0] - 2024-08-12

### Bug Fixes

- Update lint ([0c3f2a5](https://github.com/wavezync/nestjs-pgboss/commit/0c3f2a5b5940cf6b62afb8b18d9f4c9bc5295bdd))
- Update readme ([eb35c5b](https://github.com/wavezync/nestjs-pgboss/commit/eb35c5b398ceb2adaa323a524e6280fa139bd68c))
- Update readme ([9dc719c](https://github.com/wavezync/nestjs-pgboss/commit/9dc719cd8f03d048e36f92dc3f12ac0828f3a464))
- Configure dependencies ([a1d3da3](https://github.com/wavezync/nestjs-pgboss/commit/a1d3da3fc6ce167142e953e5f31bad08fa0837e1))
- Update readme ([317a55a](https://github.com/wavezync/nestjs-pgboss/commit/317a55a0c89786a062469e031849b3d42346edf7))
- Dependencies updated ([15d403b](https://github.com/wavezync/nestjs-pgboss/commit/15d403b41fb5c34375211cf8a16203821e3963ba))
- CronJob decorator updated ([b653e46](https://github.com/wavezync/nestjs-pgboss/commit/b653e46216da2914bfc97463d04ec98af495b59c))

### Miscellaneous Tasks

- Structure ([5cca195](https://github.com/wavezync/nestjs-pgboss/commit/5cca195eae36d67aebf81b6f1cd54cfa878f8131))
- Update version ([644d39e](https://github.com/wavezync/nestjs-pgboss/commit/644d39e378cd45f695634ad4a795f36654af6f61))
- Update readme ([ae321cf](https://github.com/wavezync/nestjs-pgboss/commit/ae321cfc339dca905bc53d08bc6dd455c4e51563))
- Update LICENSE ([7ca3c1e](https://github.com/wavezync/nestjs-pgboss/commit/7ca3c1e5178fe0ab9cfaf5bb8f4905a971f422f4))
- Bump version to v1.0.0 ([8e71681](https://github.com/wavezync/nestjs-pgboss/commit/8e716817c883f00b2c320e1d2de0f809b0ea1086))
