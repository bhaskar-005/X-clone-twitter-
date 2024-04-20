import axios from "axios";
import { prisma } from "../../lib/db";
import jwt from "jsonwebtoken";
import { graphqlContext } from "../../interfaces";
import { User } from "@prisma/client";
import { redisClient } from "../../redis";
import { json } from "express";

interface GoogleTokenPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: string;
  nbf: string;
  name: string;
  picture?: string;
  given_name: string;
  family_name: string;
  iat: string;
  exp: string;
  jti: string;
  alg: string;
  kid: string;
  typ: string;
}

const queries = {
  verifyGoogleToken: async (_: any, { token }: { token: string }) => {
    try {
      const googleToken = token;
      const googleAuthUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`;

      const res = await axios.get<GoogleTokenPayload>(googleAuthUrl, {
        responseType: "json",
      });

      //check if user already exists or not
      const userCheck = await prisma.user.findUnique({
        where: { email: res.data.email },
      });

      if (!userCheck) {
        const result = await prisma.user.create({
          data: {
            email: res.data.email,
            firstName: res.data.given_name,
            lastName: res.data.family_name,
            profileImage: res.data.picture || undefined,
          },
        });
      }
      const userInDb = await prisma.user.findUnique({
        where: {
          email: res.data.email,
        },
      });

      if (!userInDb) {
        throw new Error("User not found In dB");
      }
      //creating a jwt token
      const Payload = {
        id: userInDb.id,
        email: userInDb.email,
      };
      const JWTtoken = jwt.sign(Payload, process.env.JWT_SECRET!);
      console.log(JWTtoken, "<----- JWT ----<<");

      return JWTtoken;
    } catch (error) {
      console.log(error);
    }
  },
  getCurrentUser: async (_: any, args: any, context: graphqlContext) => {
    if (!context.User?.id) return null;
    const cachedCurrentUser = await redisClient.get("currentUser");
    if (cachedCurrentUser) {
      return JSON.parse(cachedCurrentUser);
    }
    const userInfo = await prisma.user.findUnique({
      where: { id: context.User?.id },
    });
    await redisClient.set("currentUser", JSON.stringify(userInfo));
    return userInfo;
  },
  getUserById: async (_: any, { id }: { id: string }) => {
    const cachedUser = await redisClient.get(`user:${id}`);
    if (cachedUser) {
      return JSON.parse(cachedUser);
    }
    const User = await prisma.user.findUnique({ where: { id: id } });
    await redisClient.setex(`user:${id}`, 140, JSON.stringify(User));
    return User;
  },
};

const mutation = {
  followUser: async (_: any, { id }: { id: string }, ctx: graphqlContext) => {
    if (!ctx.User) {
      throw new Error("user is not authenticated");
    }
    const res = await prisma.follows.create({
      data: {
        follower: { connect: { id: ctx.User.id } },
        following: { connect: { id: id } },
      },
    });
    await redisClient.del(`user:${id}`);
    await redisClient.del(`currentUser`);
    return true;
  },
  unfollowUser: async (_: any, { id }: { id: string }, ctx: graphqlContext) => {
    if (!ctx.User) {
      throw new Error("user is not authenticated");
    }
    const res = await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: ctx.User.id,
          followingId: id,
        },
      },
    });
    await redisClient.del(`user:${id}`);
    await redisClient.del(`currentUser`);
    return true;
  },
};

const extraResolver = {
  User: {
    recommendedUsers: async (_: any, perante: User, ctx: graphqlContext) => {
      if (!ctx.User?.id) {
        throw new Error("User is not authorized");
      }
      //first get your following
      const myFollowings = await prisma.follows.findMany({
        where: { follower: { id: ctx.User.id } },
        include: {
          following: {
            include: { followers: { include: { following: true } } },
          },
        },
      });
      
      return [];
    },
    tweets: (perent: User) =>
      prisma.tweet.findMany({ where: { author: { id: perent.id } } }),
    followers: async (perent: User) => {
      const res = await prisma.follows.findMany({
        where: { following: { id: perent.id } },
        include: {
          follower: true,
        },
      });
      return res.map((el) => el.follower);
    },
    following: async (perent: User) => {
      const res = await prisma.follows.findMany({
        where: { follower: { id: perent.id } },
        include: {
          following: true,
        },
      });
      return res.map((el) => el.following);
    },
  },
};
export const resolver = { queries, mutation, extraResolver };
