"use client";
import React, { useState } from "react";
import Image from "next/image";
import { BsBell, BsBookmark, BsEnvelope } from "react-icons/bs";
import { BiHash, BiHomeCircle, BiImageAlt, BiMoney, BiUser } from "react-icons/bi";
import { SlOptions } from "react-icons/sl";
import FeedCard from "./_components/FeedCard";
import { FaXTwitter } from "react-icons/fa6";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { Data } from "./data";
import { graphqlClient } from "@/graphql/api";
import {
  getCurrentUserQuery,
  verifyUserGoogleQuery,
} from "@/graphql/query/user";
import { useCurrentUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "@/gql/graphql";
import Loading from "./_components/Loading";
import ErrorPage from "./_components/Error";

const inter = "'Inter', sans-serif"; // Correct the font import

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}
interface GoogleCredential {
  clientId: string;
  credential: string;
  select_by: string;
}

const sidebarMenuItems: TwitterSidebarButton[] = [
  {
    title: "Home",
    icon: <BiHomeCircle />,
  },
  {
    title: "Explore",
    icon: <BiHash />,
  },
  {
    title: "Notifications",
    icon: <BsBell />,
  },
  {
    title: "Messages",
    icon: <BsEnvelope />,
  },
  {
    title: "Bookmarks",
    icon: <BsBookmark />,
  },
  {
    title: "Twitter Blue",
    icon: <BiMoney />,
  },
  {
    title: "Profile",
    icon: <BiUser />,
  },
  {
    title: "More Options",
    icon: <SlOptions />,
  },
];

export default function Home() {
  const { user ,isLoading ,error} = useCurrentUser();
  const [content ,setContent] = useState('');

  const queryClient = useQueryClient();

  const GoogleAuthToken = async (data: any) => {
    const toastId = toast.loading("loading..", Data.toastStyle);

    const GoogleToken = data.credential;
    if (!GoogleToken) {
      toast.error("No token found", Data.toastStyle);
      return;
    }
    const res = await graphqlClient.request(verifyUserGoogleQuery, {
      token: GoogleToken,
    });
    if (!res.verifyGoogleToken) {
      toast.dismiss(toastId);
      toast.error(
        "not able to authenticate , please try again",
        Data.toastStyle
      );
      return null;
    }
    const Token = res.verifyGoogleToken!;
    await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    window.localStorage.setItem("__token", Token);
    toast.dismiss(toastId);
    toast.success("user logged in successfully", Data.toastStyle);
  };

  if (isLoading) {
   return <Loading/>
  }
  
  if(error){
    return(
      <ErrorPage error={`Not able to fetch use details ${error.name}`} />
    )
  }
  
  const handleSelectImage = ()=>{
   const inputImg = document.createElement('input');
   inputImg.setAttribute('type','file');
   inputImg.setAttribute('accept', 'image/jpeg');
   inputImg.click();

  }
  const handleCreateTweet = ()=>{
    console.log(content);
    console.log('creating tweet');
    
  }
  return (
    <main
    className={`flex min-h-screen flex-col items-center justify-between  font-mono text-sm`}
    style={{ fontFamily: inter }} // Apply font family directly here
    >
      <div className="grid grid-cols-12 h-screen w-screen">
        <div className="col-span-3 pt-1 ml-28">
          <div className="relativ text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all">
            <FaXTwitter />
          </div>
          <div className="mt-1 text-xl pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li
                  className="flex justify-start items-center gap-4 hover:bg-gray-800 rounded-full px-3 py-3 w-fit cursor-pointer mt-2"
                  key={item.title}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 px-3">
              <button
                className="bg-[#1d9bf0] font-semibold text-lg py-2 px-4 rounded-full w-full"
                onClick={() => console.log("Tweet clicked")}
              >
                Tweet
              </button>
            </div>
            <div className="hover:bg-gray-900 cursor-pointer rounded-full px-4 py-3  absolute bottom-4 ">
              <div className="flex flex-row gap-2 items-center">
                <Image className="rounded-full " src={user?.profileImage!} alt="profile" height={40} width={40}/>
                <div>
                   <h2 className="text-[13px] -mb-1">{user?.firstName} {user?.lastName}</h2>
                   <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-5 border-r-[1px] border-l-[1px] h-screen overflow-scroll border-gray-600">
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
                      onClick={handleCreateTweet}
                      className={` ${content ? 'opacity-100 cursor-pointer':'opacity-60 cursor-default'} bg-[#1d9bf0] font-semibold text-sm py-2 px-4 rounded-full`}
                    >
                      Tweet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {Array.from({ length: 15 }, (_, i) => (
            <FeedCard key={i} />
          ))}
        </div>
        {user ? null : (
          <div className={`col-span-3 p-6 `}>
            <div className="bg-gray-800 p-6 rounded-lg w-auto flex justify-center flex-col">
              <h1 className="text-center text-[15px] mb-4">New to X ?</h1>
              <GoogleLogin onSuccess={(data) => GoogleAuthToken(data)} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
