"use client"
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
} from "@/components/ui/dialog";
import { usePathname } from 'next/navigation';
import { UpdateLevelAndStageForm } from './UpdateLevelAndStageForm';
import { DialogTitle } from '@radix-ui/react-dialog';
import Link from 'next/link';
import { ArrowLeftCircle } from 'lucide-react';

const publicRoutes = [
    '/',
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/reset-password',
    '/authenticate',
];
const UpdateLevelAndStage = ({ user }) => {
    const pathname = usePathname();
    // Assuming user.coin holds the user's coin balance from the associated Coin model
    const userCoins = user?.coinId?.coin || 0; // Check if the user has coins, default to 0 if not found
    // Check if current route is a public route
    const isPublicRoute = publicRoutes.includes(pathname as string);

    return (
        <Dialog open={!isPublicRoute}>
            <DialogContent className="w-[96%] max-w-lg">
                <div className="flex justify-between items-center px-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Update your Level and Stage</DialogTitle>
                    </DialogHeader>
                    <Link href='/' className='flex gap-0.5 items-center text-green-500 hover:text-green-700 text-xs font-bold'>
                        <ArrowLeftCircle className='w-4 h-4' /> Home
                    </Link>
                </div>
                <UpdateLevelAndStageForm />
            </DialogContent>
        </Dialog>
    );
};

export default UpdateLevelAndStage;
