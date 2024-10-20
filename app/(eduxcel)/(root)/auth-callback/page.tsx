"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { trpc } from '@/app/(eduxcel)/_trpc/client'
import { useEffect } from 'react'

const Page = () => {
  const router = useRouter()

  const searchParams = useSearchParams()
  const origin = searchParams.get('origin')

  const { isSuccess, isError } = trpc.authCallback.useQuery();

  if (isSuccess) {
    // user is synced to db
    router.push(origin ? `/${origin}` : '/dashboard')
  }

  if (isError) {
    // user is synced to db
    router.push('/')
  }

  return (
    <div className='w-full mt-24 flex justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <Loader2 className='h-8 w-8 animate-spin text-zinc-800' />
        <h3 className='font-semibold text-xl'>
          Setting up your account...
        </h3>
        <p>You will be redirected automatically.</p>
      </div>
    </div>
  )
}

export default Page
