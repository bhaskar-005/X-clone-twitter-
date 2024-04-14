"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.types = void 0;
exports.types = `#graphql
  input createTweetInput {
  content: String!
  imageUrl: String
  videoUrl: String
  }

  type Tweet {
  id: ID!
  content: String!
  imageUrl: String
  videoUrl: String
  author: User
  }
`;
