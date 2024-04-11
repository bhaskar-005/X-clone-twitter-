"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const mutation_1 = require("./mutation");
const queries_1 = require("./queries");
const types_1 = require("./types");
const resolver_1 = require("./resolver");
exports.user = { mutation: mutation_1.mutation, queries: queries_1.queries, types: types_1.types, resolver: resolver_1.resolver };
