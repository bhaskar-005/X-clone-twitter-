"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolver = void 0;
const axios_1 = __importDefault(require("axios"));
const db_1 = require("../../lib/db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const redis_1 = require("../../redis");
const queries = {
    verifyGoogleToken: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { token }) {
        try {
            const googleToken = token;
            const googleAuthUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`;
            const res = yield axios_1.default.get(googleAuthUrl, {
                responseType: "json",
            });
            //check if user already exists or not
            const userCheck = yield db_1.prisma.user.findUnique({
                where: { email: res.data.email },
            });
            if (!userCheck) {
                const result = yield db_1.prisma.user.create({
                    data: {
                        email: res.data.email,
                        firstName: res.data.given_name,
                        lastName: res.data.family_name,
                        profileImage: res.data.picture || undefined,
                    },
                });
            }
            const userInDb = yield db_1.prisma.user.findUnique({
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
            const JWTtoken = jsonwebtoken_1.default.sign(Payload, process.env.JWT_SECRET);
            console.log(JWTtoken, "<----- JWT ----<<");
            return JWTtoken;
        }
        catch (error) {
            console.log(error);
        }
    }),
    getCurrentUser: (_, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c;
        if (!((_b = context.User) === null || _b === void 0 ? void 0 : _b.id))
            return null;
        const cachedCurrentUser = yield redis_1.redisClient.get("currentUser");
        if (cachedCurrentUser) {
            return JSON.parse(cachedCurrentUser);
        }
        const userInfo = yield db_1.prisma.user.findUnique({
            where: { id: (_c = context.User) === null || _c === void 0 ? void 0 : _c.id },
        });
        yield redis_1.redisClient.set("currentUser", JSON.stringify(userInfo));
        return userInfo;
    }),
    getUserById: (_2, _d) => __awaiter(void 0, [_2, _d], void 0, function* (_, { id }) {
        const cachedUser = yield redis_1.redisClient.get(`user:${id}`);
        if (cachedUser) {
            return JSON.parse(cachedUser);
        }
        const User = yield db_1.prisma.user.findUnique({ where: { id: id } });
        yield redis_1.redisClient.setex(`user:${id}`, 140, JSON.stringify(User));
        return User;
    }),
};
const mutation = {
    followUser: (_3, _e, ctx_1) => __awaiter(void 0, [_3, _e, ctx_1], void 0, function* (_, { id }, ctx) {
        if (!ctx.User) {
            throw new Error("user is not authenticated");
        }
        const res = yield db_1.prisma.follows.create({
            data: {
                follower: { connect: { id: ctx.User.id } },
                following: { connect: { id: id } },
            },
        });
        yield redis_1.redisClient.del(`user:${id}`);
        yield redis_1.redisClient.del(`currentUser`);
        return true;
    }),
    unfollowUser: (_4, _f, ctx_2) => __awaiter(void 0, [_4, _f, ctx_2], void 0, function* (_, { id }, ctx) {
        if (!ctx.User) {
            throw new Error("user is not authenticated");
        }
        const res = yield db_1.prisma.follows.delete({
            where: {
                followerId_followingId: {
                    followerId: ctx.User.id,
                    followingId: id,
                },
            },
        });
        yield redis_1.redisClient.del(`user:${id}`);
        yield redis_1.redisClient.del(`currentUser`);
        return true;
    }),
};
const extraResolver = {
    User: {
        recommendedUsers: (_, parent, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _g;
            if (!((_g = ctx.User) === null || _g === void 0 ? void 0 : _g.id)) {
                throw new Error("User is not authorized");
            }
            // Get IDs of users the current user is following
            const followingIds = yield db_1.prisma.follows.findMany({
                where: { followerId: ctx.User.id },
                select: { followingId: true },
            });
            // Extract the following IDs from the result
            const followingIdsArray = followingIds.map(follow => follow.followingId);
            // Fetch users not in the following list
            const recommendedUsers = yield db_1.prisma.user.findMany({
                where: { NOT: [
                        { id: { in: followingIdsArray } },
                        { id: ctx.User.id }
                    ] },
            });
            console.log(recommendedUsers);
            return recommendedUsers;
        }),
        tweets: (perent) => db_1.prisma.tweet.findMany({ where: { author: { id: perent.id } } }),
        followers: (perent) => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield db_1.prisma.follows.findMany({
                where: { following: { id: perent.id } },
                include: {
                    follower: true,
                },
            });
            return res.map((el) => el.follower);
        }),
        following: (perent) => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield db_1.prisma.follows.findMany({
                where: { follower: { id: perent.id } },
                include: {
                    following: true,
                },
            });
            return res.map((el) => el.following);
        }),
    },
};
exports.resolver = { queries, mutation, extraResolver };
