import { graphql } from "@/gql";

export const verifyUserGoogleQuery = graphql(`
  query verifyUserGoogle($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const getCurrentUserQuery = graphql(`
  query GetCurrentUser {
    getCurrentUser {
      email
      firstName
      id
      lastName
      profileImage
      followers {
        firstName
        email
        lastName
        id
        profileImage
      }
      following {
        email
        firstName
        lastName
        profileImage
        id
      }
      tweets {
        content
        id
        imageUrl
        videoUrl
      }
      recommendedUsers{
        email
        firstName
        lastName
        profileImage
        id
      }
    }
  }
`);

export const getAllTweets = graphql(
  `
    query GetAllTweets {
      getAllTweets {
        author {
          firstName
          lastName
          profileImage
          id
          email
        }
        content
        imageUrl
        videoUrl
        id
        createdAt
      }
    }
  `
);

export const getUserById = graphql(`
  #graphql
  query GetUserById($id: String!) {
    getUserById(id: $id) {
      email
      firstName
      lastName
      id
      profileImage
      followers {
        firstName
        email
        lastName
        id
        profileImage
      }
      following {
        email
        firstName
        lastName
        profileImage
        id
      }
      tweets {
        content
        imageUrl
        videoUrl
        id
        author {
          email
          firstName
          lastName
          profileImage
          id
        }
      }
    }
  }
`);
