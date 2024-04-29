"use client";
import React, { useState } from "react";
import Image from "next/image";
import FeedCard from "./_components/FeedCard";
import { useCurrentUser } from "@/hooks/user";
import ErrorPage from "./_components/Error";
import { useCreateTweet, useTweets } from "@/hooks/tweets";
import { BiImageAlt, BiLoaderAlt } from "react-icons/bi";
import { IoClose } from "react-icons/io5";
import axios from 'axios';
import { MdOutlineGifBox, MdOutlineSlowMotionVideo } from "react-icons/md";



export default function Home() {
  const { user } = useCurrentUser();
  const {tweets,error } = useTweets();
  const {mutate} = useCreateTweet();
  const [content ,setContent] = useState('');
  const [image , setImage] = useState<null|File>(null);
  const [imagePrev , setImagePrev] = useState<null|string>(null);
  const [vidPrev , setvidPrev] = useState<null|string>(null);
  const [imageLoading , setImageLoading] = useState<boolean>(false);
  const [video , setVideo] = useState<null|File>(null);
  
  if(error){
    return(
      <ErrorPage error={`Not able to fetch Tweets`} />
    )
  }
  
  const handleSelectImage = ()=>{
   const inputImg = document.createElement('input');
   inputImg.setAttribute('type','file');
   inputImg.setAttribute('accept', 'image/jpeg/gif');

   inputImg.addEventListener('change', async(event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        const file = target.files[0]; 
        setImage(file);
        const imageUrl = URL.createObjectURL(file);
        setvidPrev(null);
        setImagePrev(imageUrl);

    }
  });
   inputImg.click();
  }

  const handleSelectVideo = ()=>{
    const inputVid = document.createElement('input');
    inputVid.setAttribute('type','file');
    inputVid.setAttribute('accept', 'mp4');
 
    inputVid.addEventListener('change', async(event: Event) => {
     const target = event.target as HTMLInputElement;
     if (target.files && target.files.length > 0) {
         const file = target.files[0]; 
         setVideo(file);
         const vidUrl = URL.createObjectURL(file);
         setImagePrev(null);
         setvidPrev(vidUrl);
     }
   });
   inputVid.click();
   }

  const handleCreateTweet = async()=>{
    if (content.length==0 && !image && !video) {
      return null;
    }
    setImageLoading(true)
    let imagefile;
    let videofile;
   if (image) {
     try {
      const formData = new FormData();
      formData.append('file',image);
      
      const res = await axios.post('/api/file-upload',formData)
      imagefile = res.data.url;      
      
     } catch (error) {
      console.log(error);
      return;
     }
   }
   if (video) {
    try {
      const formData = new FormData();
      formData.append('file',video);
      
      const res = await axios.post('/api/file-upload',formData)
      if (!res) {
        return null
      }
      videofile = res.data.url;      
      
     } catch (error) {
      console.log(error);
      return;
     }
   }
    mutate({
      content:content,
      imageUrl:imagefile,
      videoUrl:videofile,
    })
    setImageLoading(false)
    
  }
  return (
    <>
     {user &&(
       <div>
       <div className="border border-r-0 border-l-0 border-b-0 border-white border-opacity-20 p-5 hover:bg-white hover:bg-opacity-5  transition-all ">
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
             <div className="relative">
               {imageLoading && (
                 <div className=" absolute w-full h-full bg-black bg-opacity-60 z-10 flex justify-center items-center">
                   <BiLoaderAlt className="animate-spin text-3xl text-blue-400" />
                 </div>
               )}
               {vidPrev && (
                 <>
                   <video
                     src={vidPrev}
                     autoPlay
                     muted
                     controls
                     controlsList="nodownload"
                   ></video>
                   <div
                     onClick={() => setvidPrev(null)}
                     className="bg-black p-2 text-xl font-bold rounded-full bg-opacity-50 hover:bg-opacity-30 absolute top-2 right-2 text-white flex justify-center items-center"
                   >
                     <IoClose />
                   </div>
                 </>
               )}
               {imagePrev && (
                 <div className=" relative border-gray-800 rounded-xl overflow-hidden border-[0.4px] flex justify-center items-center">
                   <Image
                     className="h-full w-full"
                     src={imagePrev!}
                     alt="image"
                     width={400}
                     height={400}
                   />
                   <div
                     onClick={() => setImagePrev(null)}
                     className="bg-black p-2 text-xl font-bold rounded-full bg-opacity-50 hover:bg-opacity-30 absolute top-2 right-2 text-white flex justify-center items-center"
                   >
                     <IoClose />
                   </div>
                 </div>
               )}
             </div>
             <div className="mt-3 flex justify-between items-center ">
               <div className="flex gap-3 items-center">
                 <BiImageAlt
                   onClick={handleSelectImage}
                   className="text-2xl text-sky-500"
                 />
                 <MdOutlineSlowMotionVideo
                   onClick={handleSelectVideo}
                   className="text-2xl text-sky-500"
                 />
                 <MdOutlineGifBox
                   onClick={handleSelectImage}
                   className="text-2xl text-sky-500"
                 />
               </div>
               <button
                 onClick={() => handleCreateTweet()}
                 className={` bg-[#1d9bf0] font-semibold text-sm py-2 px-4 rounded-full`}
               >
                 Tweet
               </button>
             </div>
           </div>
         </div>
       </div>
     </div>
     )}
      {tweets?.map((tweet) => (
        <FeedCard data={tweet!} key={tweet?.id} />
      ))}
    </>
  );
}
