import { graphql } from "@/gql";

export const verifyUserGoogleQuery = graphql(`
query verifyUserGoogle($token: String!) {
    verifyGoogleToken(token: $token)
}`)