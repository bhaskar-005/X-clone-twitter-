"use client";
import React, { useState } from "react";
import Image from "next/image";
import FeedCard from "./_components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import ErrorPage from "./_components/Error";
import { useCreateTweet, useTweets } from "@/hooks/tweets";
import { BiImageAlt } from "react-icons/bi";
import { Tweet } from "@/gql/graphql";


export default function Home() {
  const { user } = useCurrentUser();
  const {tweets,error } = useTweets();
  const {mutate} = useCreateTweet();
  const [content ,setContent] = useState('');
  
  if(error){
    return(
      <ErrorPage error={`Not able to fetch Tweets`} />
    )
  }
  
  const handleSelectImage = ()=>{
   const inputImg = document.createElement('input');
   inputImg.setAttribute('type','file');
   inputImg.setAttribute('accept', 'image/jpeg');
   inputImg.click();

  }
  const handleCreateTweet = ()=>{
    mutate({
      content,
    })
    
  }
  return (
    <>
     <div>
            <div className="border border-r-0 border-l-0 border-b-0 border-gray-600 p-5 hover:bg-white hover:bg-opacity-5  transition-all cursor-pointer">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-1">
                  {user?.profileImage && (
                    <Image
                      className="rounded-full"
                      src={user.profileImage}
                      alt="user-image"
                      height={50}
                      width={50}
                    />
                  )}
                </div>
                <div className="col-span-11">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-transparent text-xl px-3 border-b border-slate-700 focus:outline-0 focus:border-slate-700"
                    placeholder="What's happening?"
                    rows={3}
                  ></textarea>
                  <div className="mt-2 flex justify-between items-center">
                    <BiImageAlt
                      onClick={handleSelectImage}
                      className="text-xl"
                    />
                    <button
                      onClick={()=>handleCreateTweet()}
                      className={` ${content ? 'opacity-100 cursor-pointer':'opacity-60 cursor-default'} bg-[#1d9bf0] font-semibold text-sm py-2 px-4 rounded-full`}
                    >
                      Tweet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {tweets?.map((tweet)=>(
            <FeedCard data={tweet!} key={tweet?.id}/>
          ))}
        </>
  );
}
