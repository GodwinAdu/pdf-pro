"use client"

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Loader2, Lock, LogOut, Settings } from 'lucide-react';

import { toast } from '@/hooks/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { logout } from '@/lib/helpers/logout';
import { ManageAccount } from './ManageAccount';

interface UserButtonProps {
    user: any;
}

const UserButton: React.FC<UserButtonProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = async () => {
        try {
            setIsLoading(true)
            await logout();
            router.push('/');
            toast({
                title: "Logged Out",
                description: "You have successfully logged out",
            });

        } catch (error) {
            toast({
                title: "Something went wrong",
                description: "An error occurred while trying to logout",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    aria-label='profile button'
                    onClick={toggleDropdown}
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
                        className="h-8 w-8 rounded-full"
                        src={user?.photoUrl as string}
                        alt={user?.fullName}
                    />
                </button>
            </div>

            {isOpen && (
                <div
                    className="origin-top-right absolute right-0 mt-2 w-96 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                    // role="menu"
                    // aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                >
                    <div className="py-1" role="none">
                        <div className=" px-4 py-4 border-b  text-sm text-gray-700 flex items-center gap-4">
                            <div className="">
                                <Avatar>
                                    <AvatarImage src="" alt="@shadcn" />
                                    <AvatarFallback className='capitalize'>{user?.fullName[0]}{user?.fullName[1]}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-gray-700 font-bold">
                                    {user?.fullName}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {user?.email}
                                </p>

                            </div>
                        </div>
                        <ManageAccount />
                        <button
                            aria-label='sign out button'
                            className="w-full flex gap-4 items-center px-4 py-3 border-b text-sm text-gray-700 hover:bg-gray-100 shadow-sm"
                            type='button'
                            id="user-menu-item-2"
                            disabled={isLoading}
                            onClick={handleLogout}
                        >
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                            
                            Sign out
                        </button>
                        <div className="px-4 py-4 text-sm text-gray-700 ">
                            <p className='text-[12px] text-center italic flex gap-1 justify-center items-center'>secured by <span className='font-extrabold text-indigo-500 underline'>Jutech Devs</span><Lock className='w-3 h-3' /></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserButton;
