/* eslint-disable */
import gql from 'graphql-tag'
import * as ApolloReactCommon from '@apollo/react-common'
import * as ApolloReactHooks from '@apollo/react-hooks'
export type Maybe<T> = T | null

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any
}

export type Boardgame = {
  __typename?: 'Boardgame'
  uuid: Scalars['ID']
  type: Game_Type
  name: Scalars['String']
  shortName: Scalars['String']
  aliases: Array<Scalars['String']>
  /** Link to boardgamegeek */
  url: Maybe<Scalars['String']>
  rulebook: Maybe<Scalars['String']>
  minPlayers: Scalars['Int']
  maxPlayers: Scalars['Int']
  resultsSchema: Scalars['JSONObject']
  metadataSchema: Maybe<Scalars['JSONObject']>
}

export type BoardgamesPage = {
  __typename?: 'BoardgamesPage'
  items: Array<Boardgame>
  nextOffset: Maybe<Scalars['Int']>
  total: Scalars['Int']
}

export type Club = {
  __typename?: 'Club'
  uuid: Scalars['ID']
  name: Scalars['String']
  members: Array<User>
  /** A club owner must be a claimed player */
  owner: User
}

export type Connection = {
  __typename?: 'Connection'
  uuid: Scalars['ID']
  type: ConnectionService
  user: User
  serviceId: Scalars['ID']
  name: Scalars['String']
  email: Scalars['String']
  image: Scalars['String']
}

export enum ConnectionService {
  Google = 'GOOGLE',
}

export type FriendRequest = {
  __typename?: 'FriendRequest'
  uuid: Scalars['ID']
  initiator: User
  receiver: UsersUnion
}

export enum Game_Type {
  Collaborative = 'COLLABORATIVE',
  Competitive = 'COMPETITIVE',
}

export type Match = {
  __typename?: 'Match'
  uuid: Scalars['ID']
  club: Maybe<Club>
  players: Array<User>
  winners: Array<User>
  game: Boardgame
  results: Array<Scalars['JSONObject']>
  metadata: Maybe<Scalars['JSONObject']>
  date: Scalars['DateTime']
}

export type Mutation = {
  __typename?: 'Mutation'
  addBoardgame: Boardgame
  addClub: Club
  /**
   * Disconnect from a service.
   * _Requires login._
   */
  disconnect: User
  addFriend: User
  acceptFriendRequest: User
  addMatch: Match
  /**
   * Update the name of the logged in user.
   * _Requires login._
   */
  updateName: User
  /**
   * Create a new UnclaimedUser as a friend.
   * _Requires login._
   */
  createFriend: UnclaimedUser
  /**
   * Create a User without a Connection.
   * _Development only._
   */
  addUser: User
  /**
   * Gives a session cookie for the specified User.
   * _Development only._
   */
  useUser: Scalars['Boolean']
}

export type MutationAddBoardgameArgs = {
  metadataSchema: Maybe<Scalars['JSONObject']>
  minPlayers: Maybe<Scalars['Int']>
  rulebook: Maybe<Scalars['String']>
  type: Maybe<Game_Type>
  url: Maybe<Scalars['String']>
  aliases: Maybe<Array<Scalars['String']>>
  resultsSchema: Scalars['JSONObject']
  maxPlayers: Scalars['Int']
  shortName: Scalars['String']
  name: Scalars['String']
}

export type MutationAddClubArgs = {
  name: Scalars['String']
}

export type MutationDisconnectArgs = {
  uuid: Scalars['ID']
}

export type MutationAddFriendArgs = {
  uuid: Scalars['ID']
}

export type MutationAcceptFriendRequestArgs = {
  userUuid: Scalars['ID']
}

export type MutationAddMatchArgs = {
  club: Maybe<Scalars['ID']>
  game: Scalars['ID']
  metadata: Maybe<Scalars['JSONObject']>
  results: Array<Scalars['JSONObject']>
}

export type MutationUpdateNameArgs = {
  name: Scalars['String']
}

export type MutationCreateFriendArgs = {
  name: Scalars['String']
}

export type MutationAddUserArgs = {
  name: Scalars['String']
}

export type MutationUseUserArgs = {
  uuid: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  boardgame: Maybe<Boardgame>
  boardgames: BoardgamesPage
  club: Maybe<Club>
  match: Maybe<Match>
  user: Maybe<User>
  users: Maybe<Array<User>>
  viewer: Maybe<User>
}

export type QueryBoardgameArgs = {
  uuid: Scalars['ID']
}

export type QueryBoardgamesArgs = {
  offset?: Maybe<Scalars['Int']>
  limit?: Maybe<Scalars['Int']>
}

export type QueryClubArgs = {
  uuid: Scalars['ID']
}

export type QueryMatchArgs = {
  uuid: Scalars['ID']
}

export type QueryUserArgs = {
  uuid: Scalars['ID']
}

export type UnclaimedUser = {
  __typename?: 'UnclaimedUser'
  uuid: Scalars['ID']
  name: Scalars['String']
  friends: Array<User>
  friendsSince: Maybe<Scalars['DateTime']>
}

export type User = {
  __typename?: 'User'
  uuid: Scalars['ID']
  name: Scalars['String']
  clubs: Array<Club>
  connections: Array<Connection>
  mainConnection: Maybe<Connection>
  friends: Array<UsersUnion>
  friendsSince: Maybe<Scalars['DateTime']>
  /**
   * Returns the user's friend requests.
   * _Only accessible by the owner._
   */
  friendRequests: Array<FriendRequest>
}

export type UsersUnion = User | UnclaimedUser

export type AddBoardgameMutationVariables = {
  name: Scalars['String']
  shortName: Scalars['String']
  maxPlayers: Scalars['Int']
  minPlayers: Scalars['Int']
  schema: Scalars['JSONObject']
}

export type AddBoardgameMutation = { __typename?: 'Mutation' } & {
  addBoardgame: { __typename?: 'Boardgame' } & Pick<
    Boardgame,
    'uuid' | 'name' | 'resultsSchema'
  >
}

export type UserQueryVariables = {}

export type UserQuery = { __typename?: 'Query' } & {
  viewer: Maybe<
    { __typename?: 'User' } & Pick<User, 'uuid' | 'name'> & {
        mainConnection: Maybe<
          { __typename?: 'Connection' } & Pick<
            Connection,
            'uuid' | 'type' | 'email' | 'image'
          >
        >
      }
  >
}

export type LoginConnectionsQueryVariables = {}

export type LoginConnectionsQuery = { __typename?: 'Query' } & {
  viewer: Maybe<
    { __typename?: 'User' } & Pick<User, 'uuid'> & {
        connections: Array<
          { __typename?: 'Connection' } & Pick<
            Connection,
            'uuid' | 'type' | 'email' | 'image'
          >
        >
      }
  >
}

export type AddMatchMutationVariables = {
  result: Array<Scalars['JSONObject']>
  boardgame: Scalars['ID']
}

export type AddMatchMutation = { __typename?: 'Mutation' } & {
  addMatch: { __typename?: 'Match' } & Pick<Match, 'uuid'>
}

export type BoardgamesQueryVariables = {}

export type BoardgamesQuery = { __typename?: 'Query' } & {
  boardgames: { __typename?: 'BoardgamesPage' } & {
    items: Array<
      { __typename?: 'Boardgame' } & Pick<
        Boardgame,
        'uuid' | 'maxPlayers' | 'name' | 'resultsSchema'
      >
    >
  }
}

export type PlayersQueryVariables = {}

export type PlayersQuery = { __typename?: 'Query' } & {
  users: Maybe<Array<{ __typename?: 'User' } & Pick<User, 'uuid' | 'name'>>>
}

export const AddBoardgameDocument = gql`
  mutation AddBoardgame(
    $name: String!
    $shortName: String!
    $maxPlayers: Int!
    $minPlayers: Int!
    $schema: JSONObject!
  ) {
    addBoardgame(
      name: $name
      shortName: $shortName
      maxPlayers: $maxPlayers
      minPlayers: $minPlayers
      resultsSchema: $schema
    ) {
      uuid
      name
      resultsSchema
    }
  }
`
export type AddBoardgameMutationFn = ApolloReactCommon.MutationFunction<
  AddBoardgameMutation,
  AddBoardgameMutationVariables
>

/**
 * __useAddBoardgameMutation__
 *
 * To run a mutation, you first call `useAddBoardgameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddBoardgameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addBoardgameMutation, { data, loading, error }] = useAddBoardgameMutation({
 *   variables: {
 *      name: // value for 'name'
 *      shortName: // value for 'shortName'
 *      maxPlayers: // value for 'maxPlayers'
 *      minPlayers: // value for 'minPlayers'
 *      schema: // value for 'schema'
 *   },
 * });
 */
export function useAddBoardgameMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddBoardgameMutation,
    AddBoardgameMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    AddBoardgameMutation,
    AddBoardgameMutationVariables
  >(AddBoardgameDocument, baseOptions)
}
export type AddBoardgameMutationHookResult = ReturnType<
  typeof useAddBoardgameMutation
>
export type AddBoardgameMutationResult = ApolloReactCommon.MutationResult<
  AddBoardgameMutation
>
export type AddBoardgameMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AddBoardgameMutation,
  AddBoardgameMutationVariables
>
export const UserDocument = gql`
  query User {
    viewer {
      uuid
      name
      mainConnection {
        uuid
        type
        email
        image
      }
    }
  }
`

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    UserQuery,
    UserQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<UserQuery, UserQueryVariables>(
    UserDocument,
    baseOptions,
  )
}
export function useUserLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    UserQuery,
    UserQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<UserQuery, UserQueryVariables>(
    UserDocument,
    baseOptions,
  )
}
export type UserQueryHookResult = ReturnType<typeof useUserQuery>
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>
export type UserQueryResult = ApolloReactCommon.QueryResult<
  UserQuery,
  UserQueryVariables
>
export const LoginConnectionsDocument = gql`
  query LoginConnections {
    viewer {
      uuid
      connections {
        uuid
        type
        email
        image
      }
    }
  }
`

/**
 * __useLoginConnectionsQuery__
 *
 * To run a query within a React component, call `useLoginConnectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLoginConnectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLoginConnectionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useLoginConnectionsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    LoginConnectionsQuery,
    LoginConnectionsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    LoginConnectionsQuery,
    LoginConnectionsQueryVariables
  >(LoginConnectionsDocument, baseOptions)
}
export function useLoginConnectionsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    LoginConnectionsQuery,
    LoginConnectionsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    LoginConnectionsQuery,
    LoginConnectionsQueryVariables
  >(LoginConnectionsDocument, baseOptions)
}
export type LoginConnectionsQueryHookResult = ReturnType<
  typeof useLoginConnectionsQuery
>
export type LoginConnectionsLazyQueryHookResult = ReturnType<
  typeof useLoginConnectionsLazyQuery
>
export type LoginConnectionsQueryResult = ApolloReactCommon.QueryResult<
  LoginConnectionsQuery,
  LoginConnectionsQueryVariables
>
export const AddMatchDocument = gql`
  mutation addMatch($result: [JSONObject!]!, $boardgame: ID!) {
    addMatch(
      club: "40d950d8-4bb1-419d-9616-2fb0d7dc7aa7"
      game: $boardgame
      results: $result
    ) {
      uuid
    }
  }
`
export type AddMatchMutationFn = ApolloReactCommon.MutationFunction<
  AddMatchMutation,
  AddMatchMutationVariables
>

/**
 * __useAddMatchMutation__
 *
 * To run a mutation, you first call `useAddMatchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMatchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMatchMutation, { data, loading, error }] = useAddMatchMutation({
 *   variables: {
 *      result: // value for 'result'
 *      boardgame: // value for 'boardgame'
 *   },
 * });
 */
export function useAddMatchMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    AddMatchMutation,
    AddMatchMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    AddMatchMutation,
    AddMatchMutationVariables
  >(AddMatchDocument, baseOptions)
}
export type AddMatchMutationHookResult = ReturnType<typeof useAddMatchMutation>
export type AddMatchMutationResult = ApolloReactCommon.MutationResult<
  AddMatchMutation
>
export type AddMatchMutationOptions = ApolloReactCommon.BaseMutationOptions<
  AddMatchMutation,
  AddMatchMutationVariables
>
export const BoardgamesDocument = gql`
  query Boardgames {
    boardgames {
      items {
        uuid
        maxPlayers
        name
        resultsSchema
      }
    }
  }
`

/**
 * __useBoardgamesQuery__
 *
 * To run a query within a React component, call `useBoardgamesQuery` and pass it any options that fit your needs.
 * When your component renders, `useBoardgamesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBoardgamesQuery({
 *   variables: {
 *   },
 * });
 */
export function useBoardgamesQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    BoardgamesQuery,
    BoardgamesQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<BoardgamesQuery, BoardgamesQueryVariables>(
    BoardgamesDocument,
    baseOptions,
  )
}
export function useBoardgamesLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    BoardgamesQuery,
    BoardgamesQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    BoardgamesQuery,
    BoardgamesQueryVariables
  >(BoardgamesDocument, baseOptions)
}
export type BoardgamesQueryHookResult = ReturnType<typeof useBoardgamesQuery>
export type BoardgamesLazyQueryHookResult = ReturnType<
  typeof useBoardgamesLazyQuery
>
export type BoardgamesQueryResult = ApolloReactCommon.QueryResult<
  BoardgamesQuery,
  BoardgamesQueryVariables
>
export const PlayersDocument = gql`
  query players {
    users {
      uuid
      name
    }
  }
`

/**
 * __usePlayersQuery__
 *
 * To run a query within a React component, call `usePlayersQuery` and pass it any options that fit your needs.
 * When your component renders, `usePlayersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePlayersQuery({
 *   variables: {
 *   },
 * });
 */
export function usePlayersQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    PlayersQuery,
    PlayersQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<PlayersQuery, PlayersQueryVariables>(
    PlayersDocument,
    baseOptions,
  )
}
export function usePlayersLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    PlayersQuery,
    PlayersQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<PlayersQuery, PlayersQueryVariables>(
    PlayersDocument,
    baseOptions,
  )
}
export type PlayersQueryHookResult = ReturnType<typeof usePlayersQuery>
export type PlayersLazyQueryHookResult = ReturnType<typeof usePlayersLazyQuery>
export type PlayersQueryResult = ApolloReactCommon.QueryResult<
  PlayersQuery,
  PlayersQueryVariables
>
