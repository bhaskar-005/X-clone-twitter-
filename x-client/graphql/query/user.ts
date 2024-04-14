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
    }
  }
`);
