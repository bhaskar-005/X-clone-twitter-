import React from "react";
import Image from "next/image";
import { BiMessageRounded, BiUpload } from "react-icons/bi";
import { FaRetweet } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { Tweet } from "@/gql/graphql";
import { Video } from "./Video";
import Link from "next/link";

interface feedcard{
  data:Tweet
}
const FeedCard: React.FC<feedcard> = ({data}) => {
  return (
    <div className="border border-r-0 border-l-0 border-b-0 border-white border-opacity-20 p-5 hover:bg-gray-300 hover:bg-opacity-5 transition-all cursor-pointer">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-1">
           <Link href={`${data.id}`}>
           {
            data.author?.profileImage ?(
              <Image
              className="rounded-full"
              src={data.author?.profileImage!}
              alt="user-image"
              height={50}
              width={50}
              
            />
            ):(
              <Image
              className="rounded-full"
              src={`https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg`}
              alt="user-image"
              height={50}
              width={50}
              
            />
            )
           }
           </Link>
        </div>
        <div className="col-span-11">
         <Link href={`${data.author?.id}`}>
         <h5 className="text-base font-semibold">{data.author?.firstName} {data.author?.lastName} <span className="mx-2 font-normal opacity-50 text-sm">.  {data.createdAt ? new Date(data.createdAt).toLocaleString('default', { day: 'numeric', month: 'short' }) : ''}</span> </h5>
         </Link>
          <p className="text-base ">
            {data.content}
          </p>
          <div className={`rounded-xl overflow-hidden border-[0.2px] mt-4 border-white border-opacity-30 ${!data.imageUrl && !data.videoUrl ?'hidden':'block' }`}>
          {data?.imageUrl &&
            <Image
             className="w-full h-full"
              src={data.imageUrl}
              alt="user-image"
              height={600}
              width={600}
            />  }
          
            {data?.videoUrl && <Video videoUrl={data.videoUrl!}/>}
        
          </div>
          <div className="flex opacity-50 justify-between mt-5 text-xl items-center p-2 w-[90%]">
            <div>
              <BiMessageRounded />
            </div>
            <div>
              <FaRetweet />
            </div>
            <div>
              <AiOutlineHeart />
            </div>
            <div>
              <BiUpload />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedCard;