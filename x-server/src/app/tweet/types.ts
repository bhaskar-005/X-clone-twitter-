
export const types = `#graphql
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
`