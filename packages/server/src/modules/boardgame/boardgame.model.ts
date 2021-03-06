/* eslint-disable @typescript-eslint/camelcase */
import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, Int, ObjectType, registerEnumType } from 'type-graphql'
import { Column, Entity, Index } from 'typeorm'
import { IsLowercase, IsUrl, MaxLength, Min } from 'class-validator'
import AJV from 'ajv'
import Cache from 'node-cache'

import { ExtendedEntity } from '@/modules/exented-entity'
import { JsonSchemaArray, JsonSchemaObject } from '@/types/json-schema'
import { isNil, PartialPick } from '@/utils'
import { createValidationError } from '@/utils/validations'
import {
  MinimumResults,
  minimumResultsSchema,
  MinimumResultsSchema,
} from './boardgame.schema'

type BoardgameConstructor = Pick<
  Boardgame,
  | 'type'
  | 'name'
  | 'shortName'
  | 'aliases'
  | 'thumbnail'
  | 'url'
  | 'rulebook'
  | 'maxPlayers'
  | 'minPlayers'
  | 'resultsSchema'
> &
  PartialPick<Boardgame, 'uuid' | 'createdAt' | 'metadataSchema'>

export enum GAME_TYPE {
  COLLABORATIVE = 'COLLABORATIVE',
  COMPETITIVE = 'COMPETITIVE',
}
registerEnumType(GAME_TYPE, { name: 'GAME_TYPE' })

const aliasTransformer = {
  from: (arr: string[]) =>
    arr.map(alias => alias.replace(/{escaped_comma}/g, ',')),
  to: (arr: string[]) =>
    arr.map(alias => alias.replace(/,/g, '{escaped_comma}')),
}

const ajv = new AJV({
  coerceTypes: true,
  allErrors: true,
})
const validateMinimumSchema = ajv.compile(minimumResultsSchema)

const isDev = process.env.NODE_ENV === 'development'
const cache = new Cache({
  checkperiod: 500,
  stdTTL: isDev ? 1 : 60 * 1000,
  useClones: false,
})

type CachedNames = Array<[string, string]>

@Entity()
@ObjectType()
export class Boardgame extends ExtendedEntity {
  @Column({ length: 15 })
  @Field(() => GAME_TYPE)
  public type: GAME_TYPE

  @Column()
  @Index()
  @Field()
  @MaxLength(50)
  public name: string

  @Column()
  @Index({ unique: true })
  @Field()
  @MaxLength(20)
  @IsLowercase()
  public shortName: string

  @Column({ type: 'simple-array', transformer: aliasTransformer })
  @Index()
  @Field(() => [String])
  public aliases: string[]

  @Column()
  @Field()
  @IsUrl({ disallow_auth: true, protocols: ['https'] })
  public thumbnail: string

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, {
    nullable: true,
    description: 'Link to boardgamegeek',
  })
  @MaxLength(100)
  @IsUrl({
    allow_protocol_relative_urls: false,
    disallow_auth: true,
    protocols: ['https'],
    host_whitelist: ['boardgamegeek.com'],
  })
  public url: string | null

  @Column({ type: 'varchar', nullable: true })
  @Field(() => String, { nullable: true })
  @MaxLength(100)
  @IsUrl({
    allow_protocol_relative_urls: false,
    disallow_auth: true,
    protocols: ['https'],
  })
  public rulebook: string | null

  @Column({ type: 'int' })
  @Field(() => Int)
  @Min(1)
  public minPlayers: number

  @Column({ type: 'int' })
  @Field(() => Int)
  public maxPlayers: number

  @Column({ type: 'json' })
  @Field(() => GraphQLJSONObject)
  public resultsSchema: MinimumResultsSchema

  @Column({ type: 'json', nullable: true })
  @Field(() => GraphQLJSONObject, { nullable: true })
  public metadataSchema: JsonSchemaObject | null

  constructor(options: BoardgameConstructor) {
    super(options)

    this.type = options?.type
    this.name = options?.name
    this.shortName = options?.shortName
    this.aliases = options?.aliases
    this.thumbnail = options?.thumbnail
    this.url = options?.url
    this.rulebook = options?.rulebook
    this.minPlayers = options?.minPlayers
    this.maxPlayers = options?.maxPlayers
    this.resultsSchema = options?.resultsSchema
    this.metadataSchema = options?.metadataSchema ?? null
    this.createdAt = options?.createdAt!
  }

  public static validateMinimumResultsSchema(
    schema: object,
    path?: string,
  ): schema is MinimumResultsSchema {
    const result = validateMinimumSchema(schema, path)

    if (!result) {
      throw createValidationError(
        validateMinimumSchema.errors!,
        'Invalid results!',
      )
    }

    return result as boolean
  }

  public async validateResults(results: MinimumResults) {
    const enhancedResultsSchema: JsonSchemaArray = {
      type: 'array',
      items: this.resultsSchema,
      minItems: this.minPlayers,
      maxItems: this.maxPlayers,
    }
    const validate = ajv.compile(enhancedResultsSchema)

    if (!validate(results, 'results')) {
      throw createValidationError(validate.errors!, 'Invalid results!')
    }
  }

  public async validateMetadata(results: Record<string, any> | null) {
    if (isNil(this.metadataSchema)) return

    const validate = ajv.compile(this.metadataSchema)

    if (!validate(results, 'metadata')) {
      throw createValidationError(validate.errors!, 'Invalid metadata!')
    }
  }

  public static async shortNameExists(shortName: string) {
    return (await Boardgame.count({ shortName })) > 0
  }

  private static cacheKey = 'names'
  public static async getBoardgameNames(): Promise<CachedNames> {
    if (cache.has(this.cacheKey)) {
      return cache.get<CachedNames>(this.cacheKey)!
    }

    const games = await this.find({ select: ['uuid', 'name', 'shortName', 'aliases'] })

    const aliases = games
      .map<CachedNames>(game => game.aliases.map(alias => [alias, game.uuid]))
      .flat()
    const names = games
      .map<CachedNames>(game => [
        [game.name, game.uuid],
        [game.shortName, game.uuid],
        ...aliases,
      ])
      .flat()

    cache.set<CachedNames>(this.cacheKey, names)

    return names
  }
}
