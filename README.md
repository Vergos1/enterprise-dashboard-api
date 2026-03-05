# Enterprise Dashboard API

Enterprise dashboard REST API built with NestJS, TypeORM, PostgreSQL and JWT authentication.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat&logo=nestjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white)

## About

Backend API for the [Enterprise Dashboard](https://github.com/Vergos1/enterprise-dashboard) admin panel. Built with NestJS, TypeORM and PostgreSQL. Features JWT authentication with Passport, Swagger API documentation, CSV export and Docker support.

## Features

- **JWT Authentication** — Passport + JWT + bcrypt password hashing
- **TypeORM + PostgreSQL** — database management with migrations
- **Swagger** — auto-generated API documentation
- **CSV Export** — data export via `csv-writer`
- **Docker** — Dockerfile and docker-compose for easy deployment
- **Validation** — request validation via `class-validator` and `class-transformer`
- **Unit + E2E tests** — Jest and Supertest

## Tech Stack

| Technology | Purpose |
|---|---|
| NestJS | Backend framework |
| TypeScript | Type safety |
| TypeORM | Database ORM |
| PostgreSQL | Database |
| Passport + JWT | Authentication |
| Swagger | API documentation |
| Docker | Containerization |
| Jest + Supertest | Testing |
| ESLint / Prettier | Code quality |

## Getting Started

```bash
# Install dependencies
npm install

# Start in development mode
npm run start:dev

# Start in production mode
npm run start:prod

# Build
npm run build
```

### Docker

```bash
docker-compose up
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

## Author

Developed by **Ihor Yanchuk** and **vhuser**

[Vergos1](https://github.com/Vergos1) · [vhuser](https://github.com/vhuser) 
