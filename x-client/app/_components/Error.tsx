import React from 'react';
import { BiError } from 'react-icons/bi';
import { FaXTwitter } from 'react-icons/fa6';

const ErrorPage = ({error}:{error:string}) => {
  return (
    <div className='w-screen h-screen bg-black  flex justify-center items-center '>
        <div className='flex flex-col justify-center items-center '>
          <FaXTwitter className='text-5xl' />
          <div className='bg-white text-red-600  bg-opacity-10 sm:px-20 px-8 py-6 mt-8 mx-4 rounded-full flex items-center gap-2 '>
          <BiError className='text-xl' />{error} 
          </div>
        </div>          
    </div>
  );
}

export default ErrorPage;
