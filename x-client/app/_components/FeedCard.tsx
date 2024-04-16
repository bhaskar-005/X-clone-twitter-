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
    <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-white hover:bg-opacity-5 transition-all cursor-pointer">
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-1">
          {/* {data?.imageUrl ? (
            <Image
              src={data.imageUrl}
              alt="user-image"
              height={50}
              width={50}
            />
          ) : (
            <Video videoUrl={data.videoUrl!}/>
          )} */}
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
         <h5>{data.author?.firstName} {data.author?.lastName}</h5>
         </Link>
          <p className="text-xl">
            {data.content}
          </p>
          <div className="flex justify-between mt-5 text-xl items-center p-2 w-[90%]">
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