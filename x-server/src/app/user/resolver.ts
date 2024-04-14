import axios from "axios";
import { prisma } from "../../lib/db";
import jwt from 'jsonwebtoken'
import { graphqlContext } from "../../interfaces";
import { User } from "@prisma/client";


interface GoogleTokenPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: string;
  nbf: string;
  name: string;
  picture?:string;
  given_name: string;
  family_name: string;
  iat: string;
  exp: string;
  jti: string;
  alg: string;
  kid: string;
  typ: string;
}

const queries = {
  verifyGoogleToken: async(_ :any, {token}:{token:string})=>{
    try {
      const googleToken = token; 
      const googleAuthUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`
     
      const res = await axios.get<GoogleTokenPayload>(googleAuthUrl,{
        responseType: 'json'
      })
      
      //check if user already exists or not
      const userCheck = await prisma.user.findUnique({
        where:{email:res.data.email}
      })
     
      if (!userCheck) {
       const result = await prisma.user.create({
         data:{
          email:res.data.email,
          firstName:res.data.given_name,
          lastName:res.data.family_name,
          profileImage:res.data.picture || undefined,
         }
        })
      }
      const userInDb = await prisma.user.findUnique({
        where:{
          email:res.data.email
        }
      })

      if (!userInDb) {
        throw new Error('User not found In dB')
      }
      //creating a jwt token
      const Payload = {
        id:userInDb.id,
        email:userInDb.email
      }
      const JWTtoken = jwt.sign(Payload, process.env.JWT_SECRET!);
      console.log(JWTtoken , '<----- JWT ----<<');
      
      return JWTtoken;
      
    } catch (error) {
      console.log(error);
      
    }
  },
  getCurrentUser: async(_:any,args:any,context:graphqlContext)=>{
    const userInfo = await prisma.user.findUnique({where:{id:context.User?.id}}) 
    return userInfo
  }
}

const mutation = {}

const extraResolver = {
  User:{
    tweets:(perent:User)=>prisma.tweet.findMany({where:{author:{id:perent.id}}})
  }
}
export const resolver = {queries , mutation,extraResolver}