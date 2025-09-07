import React from 'react'
import Image from 'next/image';
import { Sign } from 'crypto';
import SignInFormClient from '@/modules/auth/components/sign-in-form-client';

const page = () => {
  return (
    <>
        <Image src={"/login.svg"} alt="Login-Image" width={300} height={300} className='m-6 object-cover'/>
        <SignInFormClient />
    </>
  )
}

export default page