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
exports.initServer = void 0;
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const index_1 = require("./user/index");
const cors_1 = __importDefault(require("cors"));
const jwt_1 = require("../services/jwt");
const tweet_1 = require("./tweet");
const initServer = () => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: "http://localhost:3000",
    }));
    app.use(body_parser_1.default.json());
    const server = new server_1.ApolloServer({
        typeDefs: `
      ${index_1.user.types}
      ${tweet_1.Tweet.types}
      type Query{
        ${index_1.user.queries}
        ${tweet_1.Tweet.queries}
      }
      type Mutation{
        ${tweet_1.Tweet.mutation}
      }
     `,
        resolvers: Object.assign(Object.assign({ Query: Object.assign(Object.assign({}, index_1.user.resolver.queries), tweet_1.Tweet.resolver.queries), Mutation: Object.assign({}, tweet_1.Tweet.resolver.mutation) }, index_1.user.resolver.extraResolver), tweet_1.Tweet.resolver.extraResolver),
    });
    yield server.start();
    app.use("/graphql", (0, express4_1.expressMiddleware)(server, {
        //the third perameter of the query is this context
        context: (_a) => __awaiter(void 0, [_a], void 0, function* ({ req, res }) {
            var _b;
            const JWTtoken = (_b = req.headers.__token) === null || _b === void 0 ? void 0 : _b.slice(7);
            return {
                User: req.headers.__token
                    ? yield (0, jwt_1.decodeToken)(JWTtoken)
                    : undefined,
            };
        }),
    }));
    return app;
});
exports.initServer = initServer;
