'use client'
import React from "react";
import Image from "next/image";
import { BsBell, BsBookmark, BsEnvelope } from "react-icons/bs";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { SlOptions } from "react-icons/sl";
import FeedCard from "./_components/FeedCard";
import { FaXTwitter } from "react-icons/fa6";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { Data } from "./data";
import { graphqlClient } from "@/graphql/api";
import { verifyUserGoogleQuery } from "@/graphql/query/user";
import { Token } from "graphql";

const inter = "'Inter', sans-serif"; // Correct the font import

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
}
interface GoogleCredential{
  clientId: string, 
  credential:string,
  select_by: string,
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
  const GoogleAuthToken = async(data:any)=>{
   const toastId = toast.loading('loading..',Data.toastStyle);

  const GoogleToken = data.credential;
  if (!GoogleToken) {
    toast.error('No token found',Data.toastStyle)
    return;
  }
  const res = await graphqlClient.request(
    verifyUserGoogleQuery,{token:GoogleToken}
  )
  if (!res.verifyGoogleToken) {
    toast.dismiss(toastId);
    toast.error('not able to authenticate , please try again',Data.toastStyle);
    return null;
  }
  const Token = res.verifyGoogleToken!
  console.log(Token);
  
  window.localStorage.setItem('__token',Token)
  toast.dismiss(toastId);
  toast.success('user logged in successfully',Data.toastStyle);
  }
  return (
    <main
    className={`flex min-h-screen flex-col items-center justify-between  font-mono text-sm`}
    style={{ fontFamily: inter }} // Apply font family directly here
  >
    <div className="grid grid-cols-12 h-screen w-screen">
      <div className="col-span-3 pt-1 ml-28">
        <div className="text-2xl h-fit w-fit hover:bg-gray-800 rounded-full p-4 cursor-pointer transition-all">
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
            <button className="bg-[#1d9bf0] font-semibold text-lg py-2 px-4 rounded-full w-full" onClick={() => console.log("Tweet clicked")}>
              Tweet
            </button>
          </div>
        </div>
      </div>
      <div className="col-span-5 border-r-[1px] border-l-[1px] h-screen overflow-scroll border-gray-600">
        {Array.from({ length: 15 }, (_, i) => (
          <FeedCard key={i} />
        ))}
      </div>
      <div className="col-span-3 p-6">
        <div className="bg-gray-800 p-6 rounded-lg w-auto flex justify-center flex-col">
          <h1 className="text-center text-[15px] mb-4">New to X ?</h1>
        <GoogleLogin onSuccess={(data) => GoogleAuthToken(data)} />
        </div>
      </div>
    </div>

  </main>
  );
}
