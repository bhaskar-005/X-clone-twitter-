import axios from "axios";
import { prisma } from "../lib/db";
import jwt from 'jsonwebtoken'

export const decodeToken = async(token:string)=>{
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        return decoded
    } catch (error) {
       return{} 
    }
}