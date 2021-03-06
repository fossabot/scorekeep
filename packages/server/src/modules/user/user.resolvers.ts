import {
  Arg,
  Authorized,
  Ctx,
  ID,
  Mutation,
  Query,
  Resolver,
} from 'type-graphql'
import uuid from 'uuid/v4'

import { Friendship } from '@/modules/friendship/friendship.model'
import { User } from '@/modules/user/user.model'
import { UnclaimedUser } from '@/modules/user/unclaimed-user.model'
import { SessionContext } from '@/modules/session/session.lib'
import { Session } from '@/modules/session/session.model'
import { createDescription, isNil, isUuid } from '@/utils'

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  public async user(@Arg('uuid', () => ID) uuid: string): Promise<User | null> {
    if (!isUuid(uuid)) return null

    return (await User.findOne({ uuid })) ?? null
  }

  @Query(() => [User], { nullable: true })
  public async users(): Promise<User[] | null> {
    return await User.find()
  }

  @Query(() => User, { nullable: true })
  public async viewer(@Ctx() context: SessionContext): Promise<User | null> {
    return context.session?.user ?? null
  }

  @Mutation(() => User, {
    description: createDescription('Update the name of the logged in user.', {
      login: true,
    }),
  })
  @Authorized()
  public async updateName(
    @Ctx() context: SessionContext,
    @Arg('name') name: string,
  ) {
    const user = context.session!.user

    user.name = name
    await user.save()

    return user
  }

  @Mutation(() => UnclaimedUser, {
    description: createDescription('Create a new UnclaimedUser as a friend.', {
      login: true,
    }),
  })
  @Authorized()
  public async createFriend(
    @Ctx() context: SessionContext,
    @Arg('name') name: string,
  ): Promise<UnclaimedUser> {
    const newUser = new UnclaimedUser({ name })
    await newUser.save()

    const friendship = new Friendship({
      initiatorUuid: context.session!.user.uuid,
      receiverUuid: newUser.uuid,
      accepted: new Date(),
    })
    await friendship.save()

    return newUser
  }

  // Development shit

  @Mutation(() => User, {
    description: createDescription('Create a User without a Connection.', {
      dev: true,
    }),
  })
  public async addUser(@Arg('name') name: string) {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('NOT_IN_DEVELOPMENT')
    }

    const user = new User({
      name,
      mainConnectionUuid: uuid(),
    })

    return user.save()
  }

  @Mutation(() => Boolean, {
    description: createDescription('Gives a session cookie for the specified User.', {
      dev: true,
    }),
  })
  public async useUser(
    @Ctx() context: SessionContext,
    @Arg('uuid') uuid: string,
  ) {
    if (process.env.NODE_ENV !== 'development') {
      throw new Error('NOT_IN_DEVELOPMENT')
    }

    const user = await User.findOne({ uuid })
    if (isNil(user)) {
      throw new Error('User does not exist!')
    }

    const session = await Session.generate(user)

    context.setSession(session)

    return true
  }
}
