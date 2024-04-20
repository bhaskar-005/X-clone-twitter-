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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolver = void 0;
const db_1 = require("../../lib/db");
const redis_1 = require("../../redis");
const queries = {
    getAllTweets: () => __awaiter(void 0, void 0, void 0, function* () {
        const cachedTweets = yield redis_1.redisClient.get("allTweets");
        if (cachedTweets) {
            return JSON.parse(cachedTweets);
        }
        const res = yield db_1.prisma.tweet.findMany({ orderBy: { createdAt: 'desc' } });
        yield redis_1.redisClient.set("allTweets", JSON.stringify(res));
        return res;
    })
};
const mutation = {
    createTweet: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { payload }, ctx) {
        var _b;
        if (!((_b = ctx.User) === null || _b === void 0 ? void 0 : _b.id)) {
            throw new Error('You are not authenticated');
        }
        const rateLimitFlag = yield redis_1.redisClient.get(`CreateTweetLimite-${ctx.User.id}`);
        if (rateLimitFlag) {
            throw new Error('wait for 50s before creating new tweet');
        }
        const res = yield db_1.prisma.tweet.create({
            data: {
                content: payload.content,
                imageUrl: payload.imageUrl,
                videoUrl: payload.videoUrl,
                author: { connect: { id: ctx.User.id } }
            }
        });
        yield redis_1.redisClient.setex(`CreateTweetLimite-${ctx.User.id}`, 30, 1);
        yield redis_1.redisClient.del('allTweets');
        return res;
    })
};
//we have to get the author from perent tweet
const extraResolver = {
    Tweet: {
        author: (parent) => db_1.prisma.user.findUnique({ where: { id: parent.authorId } })
    }
};
exports.resolver = { queries, mutation, extraResolver };
