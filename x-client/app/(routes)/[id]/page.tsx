import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BsArrowLeftShort } from 'react-icons/bs';
import { useGetUserbyId, useCurrentUser } from '@/hooks/user';
import { followUserMutation, unfollowUserMutation } from '@/graphql/mutation/user';
import { graphqlClient } from '@/graphql/api';
import { getCurrentUserQuery } from '@/graphql/query/user';
import FeedCard from '@/app/_components/FeedCard';
import Image from 'next/image';
import { Tweet } from '@/gql/graphql';

const Page = () => {
  const queryClient = useQueryClient();
  const router = useParams();
  const { user } = useGetUserbyId({ id: router.id as string });
  const res = useCurrentUser();

  const handleFollow = async () => {
    await graphqlClient.request(followUserMutation, { followUserId: user?.id! });
    await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
  };

  const handleUnfollow = async () => {
    await graphqlClient.request(unfollowUserMutation, { unfollowUserId: user?.id! });
    await queryClient.invalidateQueries({ queryKey: ['currentUser'] });
  };

  const profileImage = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
  
  return (
    <div>
      <nav className="flex items-center gap-3 py-3 px-3">
        <Link href={'/'}>
          <BsArrowLeftShort className="text-4xl" />
        </Link>
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
        <Image
          src={user?.profileImage ? user.profileImage : profileImage}
          alt="user-image"
          className="rounded-full"
          width={100}
          height={100}
        />
        <div className="flex justify-between">
          <div className="flex text-sm gap-2 mt-5 opacity-50">
            <p>
              <span>{user?.followers?.length}</span> Followers
            </p>
            <p>
              <span>{user?.following?.length}</span> Following
            </p>
          </div>
          {res.data?.getCurrentUser?.id !== user?.id ? (
            <div>
              {res.user?.following?.some((el) => el?.id === user?.id) ? (
                <button onClick={handleUnfollow} className="bg-white px-4 py-2 text-sm text-black rounded-3xl">
                  Unfollow
                </button>
              ) : (
                <button onClick={handleFollow} className="bg-white px-4 py-2 text-sm text-black rounded-3xl">
                  Follow
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>

      <div className='no-scrollbar'>
        {user?.tweets?.map((tweet) => (
          <FeedCard data={tweet as Tweet} key={tweet?.id} />
        ))}
        {user?.tweets?.length === 0 && (
          <div className='text-[14px] font-bold mt-10 mx-4 text-center'>No tweets found</div>
        )}
      </div>
    </div>
  );
};

export default Page;
