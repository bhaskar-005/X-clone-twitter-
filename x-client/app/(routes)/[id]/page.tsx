'use client'
import FeedCard from '@/app/_components/FeedCard';
import { Tweet } from '@/gql/graphql';
import { graphqlClient } from '@/graphql/api';
import { followUserMutation, unfollowUserMutation } from '@/graphql/mutation/user';
import { getCurrentUserQuery } from '@/graphql/query/user';
import { useCurrentUser, useGetUserbyId } from '@/hooks/user';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';

const page = () => {
  const queryClient = useQueryClient();
  const router = useParams();
  const {user} = useGetUserbyId({id:router.id as string})
  const res = useCurrentUser();

  const handleFollow = async()=>{
    
    await graphqlClient.request(followUserMutation,{followUserId:user?.id!})
    await queryClient.invalidateQueries({queryKey:['currentUser']})
  }
  const handleUnfollow = async()=>{
    await graphqlClient.request(unfollowUserMutation,{unfollowUserId:user?.id!})
    await queryClient.invalidateQueries({queryKey:['currentUser']})
  }
  return (
    <div>
      <div>
        <nav className="flex items-center gap-3 py-3 px-3">
          <BsArrowLeftShort className="text-4xl" />
          <div>
            <h1 className="text-xl font-bold">
              {user?.firstName} {user?.lastName}
            </h1>
            <h1 className="text-md font-bold text-slate-500">
              {user?.tweets?.length} Tweets
            </h1>
          </div>
        </nav>
        <div className="p-4 border-b border-slate-800">
          {user?.profileImage && (
            <Image
              src={user.profileImage}
              alt="user-image"
              className="rounded-full"
              width={100}
              height={100}
            />
          )}
          <div className="flex justify-between">
            <div className="flex text-sm gap-2 mt-5 opacity-50">
              <p>
                <span>{user?.followers?.length}</span> Followers
              </p>
              <p>
                <span>{user?.following?.length}</span> Following
              </p>
            </div>
           {
            res.data?.getCurrentUser?.id !== user?.id ? (
              <div>
              {res.user?.following?.some((el) => el?.id === user?.id) ? (
                <button onClick={()=>handleUnfollow()} className="bg-white px-4 py-2 text-sm text-black rounded-3xl">
                  Unfollow
                </button>
              ) : (
                <button onClick={()=>handleFollow()} className="bg-white px-4 py-2 text-sm text-black rounded-3xl">
                  Follow
                </button>
              )}
            </div>
            ):(null)
           }
          </div>
        </div>

        <div className='no-scrollbar'>
          {user?.tweets?.map((tweet) => (
            <FeedCard data={tweet as Tweet} key={tweet?.id} />
          ))}
        </div>
      </div>
    </div>
  );
    };

export default page;
