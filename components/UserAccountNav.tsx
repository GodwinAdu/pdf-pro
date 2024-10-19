"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

import { Button } from './ui/button'
import { Avatar, AvatarFallback } from './ui/avatar'
import Image from 'next/image'

import Link from 'next/link'
import { Book, Gem, LayoutDashboard, LogOut, LogOutIcon, MessageCircle, Settings, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { ProfileModal } from './common/ProfileModal'




const UserAccountNav = ({ user }) => {
  const router = useRouter();



  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label='profile button'
          type="button"
          className="flex items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
          id="user-menu-button"
          aria-haspopup="true"
        >
          <span className="sr-only">Open user menu</span>
          <Image
            width={100}
            height={100}
            quality={100}
            unoptimized
            className="h-8 w-8 p-0.5 rounded-full"
            src={user?.imageUrl ? user?.imageUrl : "/assets/user.svg"}
            alt="profile image"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className='px-4 py-2 w-56 md:w-72'>
        <p className='font-bold text-sm'>{user?.fullName}</p>
        <p className='text-xs text-muted-foreground'>{user?.email}</p>
        <DropdownMenuSeparator />
        <DropdownMenuItem className='font-bold' onClick={() => router.push(`/user/${user._id}`)}><LayoutDashboard className='w-4 h-4 mr-2' />Dashboard</DropdownMenuItem>
        <ProfileModal user={user} />
        <DropdownMenuItem onClick={() => router.push('/contact')}><MessageCircle className='w-4 h-4 mr-2' />Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem><LogOut className='w-4 h-4 mr-2' />Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserAccountNav
