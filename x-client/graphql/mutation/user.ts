import { graphql } from "@/gql";

export const followUserMutation = graphql(
    `mutation FollowUser($followUserId: ID!) {
        followUser(id: $followUserId)
      }`
)
export const unfollowUserMutation = graphql(
    `mutation UnfollowUser($unfollowUserId: ID!) {
        unfollowUser(id: $unfollowUserId)
      }`
)