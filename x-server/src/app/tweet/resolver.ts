import { Tweet } from "@prisma/client"
import { createTweetPayload, graphqlContext } from "../../interfaces"
import { prisma } from "../../lib/db"
import { redisClient } from "../../redis"

 const queries = {
    getAllTweets: async()=>{
      const cachedTweets = await redisClient.get("allTweets");
      if (cachedTweets) {
         return JSON.parse(cachedTweets);
       }
      const res = await prisma.tweet.findMany({orderBy:{createdAt:'desc'}})
      await redisClient.set("allTweets",JSON.stringify(res));
      return res;
      }
}


 const mutation = {
    createTweet:async(parent:any ,{payload}:{payload:createTweetPayload},ctx:graphqlContext)=>{
       if (!ctx.User?.id) {
        throw new Error('You are not authenticated')
       }
       const rateLimitFlag = await redisClient.get(`CreateTweetLimite-${ctx.User.id}`);
       if (rateLimitFlag) {
         throw new Error('wait for 50s before creating new tweet')
       }
     const res = await prisma.tweet.create({
        data:{
            content:payload.content,
            imageUrl:payload.imageUrl,
            videoUrl:payload.videoUrl,
            author:{connect:{id:ctx.User.id}}
        }
     })
     await redisClient.setex(`CreateTweetLimite-${ctx.User.id}`,30,1);
     await redisClient.del('allTweets');
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