'use client'
import FeedCard from '@/app/_components/FeedCard';
import { Tweet } from '@/gql/graphql';
import { useGetUserbyId } from '@/hooks/user';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React from 'react';
import { BsArrowLeftShort } from 'react-icons/bs';

const page = () => {
  const router = useParams();
  const {user} = useGetUserbyId({id:router.id as string})

  return (
        <div>
            <div>
              <nav className="flex items-center gap-3 py-3 px-3">
                <BsArrowLeftShort className="text-4xl" />
                <div>
                  <h1 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h1>
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
                <h1 className="text-2xl font-bold mt-5"></h1>
              </div>
              <div>
                {user?.tweets?.map((tweet) => (
                  <FeedCard data={tweet as Tweet} key={tweet?.id} />
                ))}
              </div>
            </div>
        </div>
      );
    };

export default page;
