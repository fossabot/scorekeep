// eslint-disable-next-line node/no-extraneous-import
import dotenv from 'dotenv'
import { EngineReportingOptions } from 'apollo-engine-reporting'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { Environment } from '@/constants'

type Config = {
  [key in Environment]: {
    db: PostgresConnectionOptions
    apolloEngine?: EngineReportingOptions<unknown>
  }
}

dotenv.config()

const defaultDbConfig = {
  type: 'postgres' as const,
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USER || 'scorekeep-admin',
  password: process.env.DATABASE_PASS || "ADAM's COOL",
  database: 'postgres',
  url: process.env.DATABASE_URL,

  logging: false,
  entities: ['src/modules/**/*.model.ts'],
  seeds: ['src/modules/**/*.seed.ts'],
  factories: ['src/modules/**/*.factory.ts'],
  migrations: ['migrations/**/*.ts'],
  cli: {
    entitiesDir: 'src/modules',
    migrationsDir: 'migrations',
    subscribersDir: 'src/subscribers',
  },
}

const _config: Config = {
  [Environment.DEVELOPMENT]: {
    db: {
      ...defaultDbConfig,
      synchronize: true,
      migrationsRun: true,
    },
  },
  [Environment.TEST]: {
    db: {
      ...defaultDbConfig,
      schema: 'scorekeep-tests',
      synchronize: true,
      dropSchema: true,
    },
  },
  [Environment.PRODUCTION]: {
    db: {
      ...defaultDbConfig,
      url: process.env.DATABASE_URL,
      migrationsRun: true,
    },
    apolloEngine: {
      apiKey: process.env.APOLLO_ENGINE_KEY,
    },
  },
}

export const config =
  _config[(process.env.NODE_ENV || 'development') as Environment]
