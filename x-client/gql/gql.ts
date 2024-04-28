/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "#graphql\n    mutation CreateTweet($payload: createTweetInput) {\n     createTweet(payload: $payload) {\n      id\n      content\n     }\n  }\n  ": types.CreateTweetDocument,
    "mutation FollowUser($followUserId: ID!) {\n        followUser(id: $followUserId)\n      }": types.FollowUserDocument,
    "mutation UnfollowUser($unfollowUserId: ID!) {\n        unfollowUser(id: $unfollowUserId)\n      }": types.UnfollowUserDocument,
    "\n  query verifyUserGoogle($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n": types.VerifyUserGoogleDocument,
    "\n  query GetCurrentUser {\n    getCurrentUser {\n      email\n      firstName\n      id\n      lastName\n      profileImage\n      followers {\n        firstName\n        email\n        lastName\n        id\n        profileImage\n      }\n      following {\n        email\n        firstName\n        lastName\n        profileImage\n        id\n      }\n      tweets {\n        content\n        id\n        imageUrl\n        videoUrl\n      }\n    }\n  }\n": types.GetCurrentUserDocument,
    "\n    query GetAllTweets {\n      getAllTweets {\n        author {\n          firstName\n          lastName\n          profileImage\n          id\n          email\n        }\n        content\n        imageUrl\n        videoUrl\n        id\n        createdAt\n      }\n    }\n  ": types.GetAllTweetsDocument,
    "\n  #graphql\n  query GetUserById($id: String!) {\n    getUserById(id: $id) {\n      email\n      firstName\n      lastName\n      id\n      profileImage\n      followers {\n        firstName\n        email\n        lastName\n        id\n        profileImage\n      }\n      following {\n        email\n        firstName\n        lastName\n        profileImage\n        id\n      }\n      tweets {\n        content\n        imageUrl\n        videoUrl\n        id\n        author {\n          email\n          firstName\n          lastName\n          profileImage\n          id\n        }\n      }\n    }\n  }\n": types.GetUserByIdDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "#graphql\n    mutation CreateTweet($payload: createTweetInput) {\n     createTweet(payload: $payload) {\n      id\n      content\n     }\n  }\n  "): (typeof documents)["#graphql\n    mutation CreateTweet($payload: createTweetInput) {\n     createTweet(payload: $payload) {\n      id\n      content\n     }\n  }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation FollowUser($followUserId: ID!) {\n        followUser(id: $followUserId)\n      }"): (typeof documents)["mutation FollowUser($followUserId: ID!) {\n        followUser(id: $followUserId)\n      }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "mutation UnfollowUser($unfollowUserId: ID!) {\n        unfollowUser(id: $unfollowUserId)\n      }"): (typeof documents)["mutation UnfollowUser($unfollowUserId: ID!) {\n        unfollowUser(id: $unfollowUserId)\n      }"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query verifyUserGoogle($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n"): (typeof documents)["\n  query verifyUserGoogle($token: String!) {\n    verifyGoogleToken(token: $token)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query GetCurrentUser {\n    getCurrentUser {\n      email\n      firstName\n      id\n      lastName\n      profileImage\n      followers {\n        firstName\n        email\n        lastName\n        id\n        profileImage\n      }\n      following {\n        email\n        firstName\n        lastName\n        profileImage\n        id\n      }\n      tweets {\n        content\n        id\n        imageUrl\n        videoUrl\n      }\n    }\n  }\n"): (typeof documents)["\n  query GetCurrentUser {\n    getCurrentUser {\n      email\n      firstName\n      id\n      lastName\n      profileImage\n      followers {\n        firstName\n        email\n        lastName\n        id\n        profileImage\n      }\n      following {\n        email\n        firstName\n        lastName\n        profileImage\n        id\n      }\n      tweets {\n        content\n        id\n        imageUrl\n        videoUrl\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n    query GetAllTweets {\n      getAllTweets {\n        author {\n          firstName\n          lastName\n          profileImage\n          id\n          email\n        }\n        content\n        imageUrl\n        videoUrl\n        id\n        createdAt\n      }\n    }\n  "): (typeof documents)["\n    query GetAllTweets {\n      getAllTweets {\n        author {\n          firstName\n          lastName\n          profileImage\n          id\n          email\n        }\n        content\n        imageUrl\n        videoUrl\n        id\n        createdAt\n      }\n    }\n  "];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  #graphql\n  query GetUserById($id: String!) {\n    getUserById(id: $id) {\n      email\n      firstName\n      lastName\n      id\n      profileImage\n      followers {\n        firstName\n        email\n        lastName\n        id\n        profileImage\n      }\n      following {\n        email\n        firstName\n        lastName\n        profileImage\n        id\n      }\n      tweets {\n        content\n        imageUrl\n        videoUrl\n        id\n        author {\n          email\n          firstName\n          lastName\n          profileImage\n          id\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  #graphql\n  query GetUserById($id: String!) {\n    getUserById(id: $id) {\n      email\n      firstName\n      lastName\n      id\n      profileImage\n      followers {\n        firstName\n        email\n        lastName\n        id\n        profileImage\n      }\n      following {\n        email\n        firstName\n        lastName\n        profileImage\n        id\n      }\n      tweets {\n        content\n        imageUrl\n        videoUrl\n        id\n        author {\n          email\n          firstName\n          lastName\n          profileImage\n          id\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;