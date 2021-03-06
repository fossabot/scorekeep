import { Connection as DBConnection } from 'typeorm'
import gql from 'graphql-tag'

import { connectToDatabase } from '@/db'
import { createApolloClient, generateUser, TestClient } from '@/utils/tests'
import { GAMES, getTestBoardgames } from '@/utils/test-data'
import { Boardgame } from '@/modules/boardgame/boardgame.model'
import { mapAsync } from '@/utils'

let client: TestClient
let dbConnection: DBConnection

beforeAll(async () => {
  client = await createApolloClient()
  dbConnection = await connectToDatabase()
})

afterAll(() => dbConnection.close())

beforeEach(async () => {
  await dbConnection.synchronize(true)
})

describe('resolvers', () => {
  describe('addBoardgame', () => {
    const addBoardgame = gql`
      mutation AddBoardgame(
        $name: String!
        $shortName: String!
        $aliases: [String!]!
        $thumbnail: String!
        $url: String
        $maxPlayers: Int!
        $resultsSchema: JSONObject!
        $metadataSchema: JSONObject
      ) {
        addBoardgame(
          type: COMPETITIVE
          name: $name
          shortName: $shortName
          aliases: $aliases
          thumbnail: $thumbnail
          url: $url
          maxPlayers: $maxPlayers
          resultsSchema: $resultsSchema
          metadataSchema: $metadataSchema
        ) {
          uuid
          shortName
          resultsSchema
        }
      }
    `

    test('should add a boardgame', async () => {
      const generated = await generateUser()
      const {
        name,
        shortName,
        aliases,
        thumbnail,
        url,
        maxPlayers,
        resultsSchema,
        metadataSchema,
      } = GAMES.scythe.boardgame

      const response = await client.mutate(addBoardgame, {
        session: generated.session,
        variables: {
          name,
          shortName,
          aliases,
          thumbnail,
          url,
          maxPlayers,
          resultsSchema,
          metadataSchema,
        },
      })

      expect(response.errors).toBeUndefined()
      expect(response.data).toMatchObject({
        addBoardgame: {
          uuid: expect.any(String),
          shortName,
          resultsSchema,
        },
      })
    })

    test('should fail without minimum schema', async () => {
      const generated = await generateUser()

      const response = await client.mutate(addBoardgame, {
        session: generated.session,
        variables: {
          name: 'FakeBoardgame',
          shortName: 'fakeboardgame',
          aliases: [],
          thumbnail: 'url',
          url: null,
          maxPlayers: 2,
          resultsSchema: {
            something: {
              type: 'boolean',
            },
          },
          metadataSchema: null,
        },
      })

      expect(response.errors).not.toBeUndefined()
      expect(response.errors).toMatchObject([
        {
          extensions: {
            code: 'BAD_USER_INPUT',
            exception: {
              validation: [
                {
                  message: "should have required property 'type'",
                  path: ['resultsSchema'],
                },
                {
                  message: "should have required property 'required'",
                  path: ['resultsSchema'],
                },
                {
                  message: "should have required property 'properties'",
                  path: ['resultsSchema'],
                },
              ],
            },
          },
        },
      ])
    })

    test('should fail without required "player" and "winner" fields', async () => {
      const generated = await generateUser()

      const response = await client.mutate(addBoardgame, {
        session: generated.session,
        variables: {
          name: 'FakeBoardgame',
          shortName: 'fakeboardgame',
          aliases: [],
          thumbnail: 'url',
          url: null,
          maxPlayers: 2,
          resultsSchema: {
            type: 'object',
            required: ['player', 'winner'],
            properties: {},
          },
          metadataSchema: null,
        },
      })

      expect(response.errors).not.toBeUndefined()
      expect(response.errors).toMatchObject([
        {
          extensions: {
            code: 'BAD_USER_INPUT',
            exception: {
              validation: [
                {
                  message: "should have required property 'player'",
                  path: ['resultsSchema', 'properties'],
                },
                {
                  message: "should have required property 'winner'",
                  path: ['resultsSchema', 'properties'],
                },
              ],
            },
          },
        },
      ])
    })

    test("should fail if 'player' and 'winner' fields aren't required", async () => {
      const generated = await generateUser()

      const response = await client.mutate(addBoardgame, {
        session: generated.session,
        variables: {
          name: 'FakeBoardgame',
          shortName: 'fakeboardgame',
          aliases: [],
          thumbnail: 'url',
          url: null,
          maxPlayers: 2,
          resultsSchema: {
            type: 'object',
            required: ['test', 'foo'],
            properties: {
              player: {
                type: 'string',
              },
              winner: {
                type: 'boolean',
              },
            },
          },
          metadataSchema: null,
        },
      })

      expect(response.errors).not.toBeUndefined()
      expect(response.errors).toMatchObject([
        {
          extensions: {
            code: 'BAD_USER_INPUT',
            exception: {
              validation: [
                {
                  message: 'should be equal to one of the allowed values',
                  path: ['resultsSchema', 'required', '[0]'],
                },
                {
                  message: 'should be equal to one of the allowed values',
                  path: ['resultsSchema', 'required', '[1]'],
                },
              ],
            },
          },
        },
      ])
    })
  })

  describe('boardgames', () => {
    const boardgamesQuery = gql`
      query GetBoardgames($search: String!) {
        boardgames(search: $search) {
          items {
            uuid
            name
            shortName
          }
        }
      }
    `
    beforeEach(async () => {
      await mapAsync(getTestBoardgames(), game => game.save())
    })

    test('search works as intended', async () => {
      const response = await client.query(boardgamesQuery, {
        variables: {
          search: 'wind',
        },
      })

      const shortNameResult = (shortName: string) => ({
        uuid: expect.any(String),
        name: expect.any(String),
        shortName,
      })
      expect(response.errors).toBeUndefined()
      expect(response.data.boardgames.items[0]).toMatchObject(
        shortNameResult('wingspan'),
      )
      expect(response.data.boardgames.items[1]).toMatchObject(
        shortNameResult('7-wonders'),
      )
    })

    test('returns [] if none are found', async () => {
      const response = await client.query(boardgamesQuery, {
        variables: {
          search: '93476b76n934vy2b76n89p4',
        },
      })

      expect(response.errors).toBeUndefined()
      expect(response.data.boardgames.items.length).toBe(0)
    })
  })
})

describe('statics', () => {
  describe('getBoardgameNames', () => {
    let games: Boardgame[] = []

    beforeEach(async () => {
      games = await Promise.all(
        getTestBoardgames().map(boardgame => boardgame.save()),
      )
    })

    test('returns name:uuid map', async () => {
      const result = await Boardgame.getBoardgameNames()

      const aliases = games
        .map(game => game.aliases.map(alias => [alias, game.uuid]))
        .flat()
      const expectedResult = games
        .map(game => {
          return [
            [game.name, game.uuid],
            [game.shortName, game.uuid],
            ...aliases,
          ]
        })
        .flat()

      const sortedResult = result.sort((a, b) => a[0].localeCompare(b[0]))
      const sortedExpectedResult = expectedResult.sort((a, b) => a[0].localeCompare(b[0]))

      expect(sortedResult).toMatchObject(sortedExpectedResult)
    })
  })
})
