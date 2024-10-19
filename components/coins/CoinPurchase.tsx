"use client"
import React from 'react';
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import Image from 'next/image';
import CoinPurchaseForm from './CoinPurchaseForm';
import { usePathname } from 'next/navigation';

const publicRoutes = [
    '/',
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/reset-password',
    '/authenticate',
];
const CoinPurchase = ({ user }) => {
    const pathname = usePathname()
    // Assuming user.coin holds the user's coin balance from the associated Coin model
    const userCoins = user?.coinId?.coin || 0; // Check if the user has coins, default to 0 if not found
     // Check if current route is a public route
     const isPublicRoute = publicRoutes.includes(pathname as string);

    return (
        <Dialog open={!isPublicRoute && userCoins <= 0}>
            <DialogContent className="w-[96%] max-w-lg">
                <div className="mx-auto">
                    <Image
                        src="/icons/coin.svg"
                        alt="Avatar"
                        width={150}
                        height={150}
                    />
                </div>
                <div className="py-4">
                    <CoinPurchaseForm user={user} />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CoinPurchase;
