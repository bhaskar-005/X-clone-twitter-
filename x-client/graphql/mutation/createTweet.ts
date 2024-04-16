import { graphql } from "@/gql";

export const createTweet = graphql(
  `#graphql
    mutation CreateTweet($payload: createTweetInput) {
     createTweet(payload: $payload) {
      id
      content
     }
  }
  `
);
