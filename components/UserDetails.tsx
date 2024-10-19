import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Separator } from './ui/separator'
const UserDetails = ({ user }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Avatar className='cursor-pointer'>
                    <AvatarImage src={user.imageUrl} alt="user_image" />
                    <AvatarFallback>{user?.fullName[0]}{user?.fullName[1]}</AvatarFallback>
                </Avatar>
            </DialogTrigger>
            <DialogContent className="w-[96%] max-w-lg">
                <div className="">
                    <Avatar className='w-20 h-20 md:w-32 md:h-32 mx-auto'>
                        <AvatarImage src={user.imageUrl} alt="user_profile_image" />
                        <AvatarFallback>{user?.fullName[0]}{user?.fullName[1]}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="mx-auto">
                    <h3 className='font-bold text-xl md:text-2xl'>@{user.username}</h3>
                    <p className='text-muted-foreground text-center text-sm md:text-md'>{user.fullName}</p>
                </div>
                <div className="py-4 mx-auto flex items-center gap-6">
                    <div className="text-center">
                        <Label className='font-bold'>Followers</Label>
                        <p className='font-bold'>{0}</p>
                    </div>
                    <div className="text-center">
                        <Label className='font-bold'>Following</Label>
                        <p className='font-bold'>{0}</p>
                    </div>

                </div>
                <Separator />
                <div className="mx-auto">
                    <h3 className='font-bold text-blue-500'>Social Handles</h3>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default UserDetails
