"use client";
import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { BsBell, BsBookmark, BsEnvelope } from "react-icons/bs";
import { BiHash, BiHomeCircle, BiMoney, BiUser } from "react-icons/bi";
import { SlOptions } from "react-icons/sl";
import { verifyUserGoogleQuery } from "@/graphql/query/user";
import Image from "next/image";
import { useCurrentUser } from "@/hooks/user";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/graphql/api";
import { Data } from "../data";
import Loading from "./Loading";
import ErrorPage from "./Error";
const inter = "'Inter', sans-serif";

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

const Sidebars = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading, error } = useCurrentUser();
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
    return <Loading />;
  }
  if (error) {
    return <ErrorPage error={`Not able to fetch use details ${error.name}`} />;
  }
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between  font-mono text-sm`}
      style={{ fontFamily: inter }}
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
            {user ? (
              <div className="hover:bg-gray-900 cursor-pointer rounded-full px-4 py-3  absolute bottom-4 ">
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
                  <div>
                    <h2 className="text-[13px] -mb-1">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="no-scrollbar col-span-5 border-r-[0.4px] border-l-[0.4px] h-screen overflow-scroll border-l-white border-r-white border-opacity-20 ">
          {children}
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
};

export default Sidebars;
