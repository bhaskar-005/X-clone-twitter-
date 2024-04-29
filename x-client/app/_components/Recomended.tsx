import { useCurrentUser } from '@/hooks/user';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Recomended = () => {
    const {user} = useCurrentUser();
    const profileImage = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"; 
  return (
         <div className={`col-span-3 p-6 `}>
            <div className="bg-white bg-opacity-5 border-[0.4px] border-white border-opacity-20 p-6 rounded-lg w-auto flex justify-center flex-col">
              <h1 className=" font-bold text-[18px] mb-5">You might like</h1>
               <div className='flex flex-col gap-4'>
                {
                    user?.recommendedUsers?.map((data)=>(
                         <Link key={data?.id} href={'/'+data?.id}>
                         <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <div className='rounded-full overflow-hidden w-[40px] h-[40px] flex justify-center items-center'>
                                 <Image alt='profile' src={data?.profileImage?data.profileImage:profileImage} height={100} width={100} className=' object-fill rounded-full  ' /> 
                                </div>
                            
                                <div>
                                    <h2 className='text-[14px] hover:underline'>{data?.lastName?.length! > 6 ? `${data?.firstName}`:`${data?.firstName } ${data?.lastName? data.lastName:''}`}</h2>
                                    <h3 className='opacity-40 text-xs '>{data?.email?.length!<20 ?data?.email:`${data?.email.slice(0,20)}..`}</h3>
                                </div>
                            </div>
                            <div className='bg-white hover:bg-opacity-95 text-black text-[13px] font-[700] px-4 py-2 rounded-2xl'>
                                Follow
                            </div>
                         </div>
                         </Link>
                    ))
                }
               </div>
            </div>
          </div>
  );
}

export default Recomended;
