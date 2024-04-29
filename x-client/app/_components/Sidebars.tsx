"use client";
import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { BsBell, BsBookmark, BsEnvelope, BsTwitter } from "react-icons/bs";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { SlOptions } from "react-icons/sl";
import { verifyUserGoogleQuery } from "@/graphql/query/user";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/user";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from 'next/navigation'
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/graphql/api";
import { Data } from "../data";
import Loading from "./Loading";
import ErrorPage from "./Error";
import Recomended from "./Recomended";
import Link from "next/link";
const inter = "'Inter', sans-serif";

interface TwitterSidebarButton {
  title: string;
  icon: React.ReactNode;
  Link?: string;
}
interface GoogleCredential {
  clientId: string;
  credential: string;
  select_by: string;
}

const sidebarMenuItems: TwitterSidebarButton[] = [
  {
    title: "Home",
    Link: "/",
    icon: <BiHomeCircle />
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

const Sidebars = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, error } = useCurrentUser();
  const router = useRouter();
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
    window.localStorage.setItem("__token", Token);
    if (window.localStorage.getItem('__token')) {
       await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    }
    toast.dismiss(toastId);
    toast.success("user logged in successfully", Data.toastStyle);
    router.replace('/');
    
  };
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return <ErrorPage error={`Not able to fetch use details ${error.name}`} />;
  }
  return (
    <div>
    <div className="grid grid-cols-12 h-screen w-screen sm:px-48">
      <div className="col-span-2 md:col-span-3 pt-1 flex md:justify-center pr-4 relative">
        <div>
          <div className="text-2xl h-fit w-fit hover:bg-white hover:bg-opacity-10 rounded-full p-4 cursor-pointer transition-all">
          <FaXTwitter />
          </div>
          <div className="mt-1 text-xl pr-4">
            <ul>
              {sidebarMenuItems.map((item) => (
                <li key={item.title}>
                  <Link
                    className="flex justify-start items-center gap-4 hover:bg-white hover:bg-opacity-10 rounded-full px-3 py-3 w-fit cursor-pointer mt-2"
                    href={item.Link ? item.Link : ''}
                  >
                    <span className=" text-3xl">{item.icon}</span>
                    <span className="hidden md:inline text-lg ">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 px-3 md:block hidden">
              <button className="hidden md:block bg-[#1d9bf0] font-semibold text-lg py-2 px-4 rounded-full w-full">
                Tweet
              </button>
              <button className="block md:hidden bg-[#1d9bf0] font-semibold text-lg py-2 px-4 rounded-full w-full">
                <BsTwitter />
              </button>
            </div>
          </div>
        </div>
        {user ? (
              <div className="hover:bg-white hover:bg-opacity-10 md:left-14 left-0 cursor-pointer rounded-full px-4 py-3  absolute bottom-4 ">
                <div className="flex flex-row gap-2 items-center">
                  <Image
                    className="rounded-full "
                    src={
                      user?.profileImage
                        ? user?.profileImage
                        : "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                    }
                    alt="profile"
                    height={40}
                    width={40}
                  />
                  <div className="lg:block hidden">
                    <h2 className="text-[13px] -mb-1">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                </div>
              </div>
            ) : null}
      </div>
      <div className="no-scrollbar col-span-10 md:col-span-6 border-r-[0.4px] border-l-[0.4px] h-screen overflow-scroll border-white border-opacity-20">
        {children}
      </div>
      <div className="col-span-0 md:col-span-3 flex  ">
      {user ? (<Recomended/>) : (
          <div className={`  p-6 `}>
            <div className="bg-white bg-opacity-5 border-[0.4px] border-white border-opacity-20 p-6 rounded-lg w-auto flex justify-center flex-col">
              <h1 className="text-center text-[15px] mb-5">New to X ?</h1>
              <div className="w-full justify-center items-center">
                <GoogleLogin onSuccess={(data) => GoogleAuthToken(data)} />
              </div>
               </div>
          </div>
        )}
      </div>
    </div>
  </div>
  );
};

export default Sidebars;
