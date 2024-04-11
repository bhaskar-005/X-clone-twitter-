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
const queries = {
    verifyGoogleToken: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { token }) {
        try {
            const googleToken = token;
            const googleAuthUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`;
            const res = yield axios_1.default.get(googleAuthUrl, {
                responseType: 'json'
            });
            //check if user already exists or not
            const userCheck = yield db_1.prisma.user.findUnique({
                where: { email: res.data.email }
            });
            if (!userCheck) {
                const result = yield db_1.prisma.user.create({
                    data: {
                        email: res.data.email,
                        firstName: res.data.given_name,
                        lastName: res.data.family_name,
                        profileImage: res.data.picture,
                    }
                });
            }
            const userInDb = yield db_1.prisma.user.findUnique({
                where: {
                    email: res.data.email
                }
            });
            if (!userInDb) {
                throw new Error('User not found In dB');
            }
            //creating a jwt token
            const Payload = {
                id: userInDb.id,
                email: userInDb.email
            };
            const JWTtoken = jsonwebtoken_1.default.sign(Payload, process.env.JWT_SECRET);
            console.log(JWTtoken, '<----- JWT ----<<');
            return JWTtoken;
        }
        catch (error) {
            console.log(error);
        }
    })
};
const mutation = {};
exports.resolver = { queries, mutation };
