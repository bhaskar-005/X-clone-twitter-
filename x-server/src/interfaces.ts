export interface JWTuser{
    id:string,
    email:string
}
export interface graphqlContext{
    User?:JWTuser
}

export interface createTweetPayload{
    content: string
    imageUrl?: string
    videoUrl?: string
}