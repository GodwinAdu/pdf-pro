import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { currentUser } from '@/lib/helpers/current-user'
import React from 'react'
import UserDetail from './_components/UserDetails'

const page = async () => {
  const user = await currentUser();

  const referralUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/sign-up?referral=${user.referralCode}`

  return (
   <>
   <UserDetail user={user} /> 
   </>
  )
}

export default page;
