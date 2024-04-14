import { Tweet } from "@prisma/client"
import { createTweetPayload, graphqlContext } from "../../interfaces"
import { prisma } from "../../lib/db"

 const queries = {
    getAllTweets: async()=>{
       return await prisma.tweet.findMany({orderBy:{createdAt:'desc'}})
    }
}


 const mutation = {
    createTweet:async(parent:any ,{payload}:{payload:createTweetPayload},ctx:graphqlContext)=>{
       if (!ctx.User?.id) {
        throw new Error('You are not authenticated')
       }
     const res = await prisma.tweet.create({
        data:{
            content:payload.content,
            imageUrl:payload.imageUrl,
            videoUrl:payload.videoUrl,
            author:{connect:{id:ctx.User.id}}
        }
     })
     return res
    }
    
}
//we have to get the author from perent tweet
const extraResolver = {
    Tweet:{
    author: (parent:Tweet )=>prisma.user.findUnique({where:{id:parent.authorId}})
  }
}

export const resolver = {queries,mutation,extraResolver}