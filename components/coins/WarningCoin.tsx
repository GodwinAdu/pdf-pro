
"use client"

import React, { useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import Image from 'next/image';
import CoinPurchaseForm from './CoinPurchaseForm';
import { checkAndResetWarning, useWarningStore } from '@/hooks/use-warning-store';
import { usePathname } from 'next/navigation';

const publicRoutes = [
    '/',
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/authenticate',
];
const CoinPurchase = ({ user }) => {
    const pathname = usePathname()
    const userCoins = user?.coinId?.coin || 0; // Get user's current coins
    const { warningClosed, setWarningClosed } = useWarningStore(); // Access Zustand store

       // Check if current route is a public route
       const isPublicRoute = publicRoutes.includes(pathname as string);

    useEffect(() => {
        // Check and reset the warning if 24 hours have passed
        checkAndResetWarning();
    }, []);

    // Only show the modal if the user has less than 20 coins and hasn't closed the warning in the last 24 hours
    const shouldShowModal = !isPublicRoute && userCoins > 0 && userCoins < 20 && !warningClosed;

    return (
        <Dialog open={shouldShowModal} onOpenChange={(isOpen) => {
            if (!isOpen) setWarningClosed(); // If user closes modal, set warning as closed
        }}>
            <DialogContent className="w-[96%] max-w-lg">
                <div className="mx-auto">
                    <Image
                        src="/icons/coin.svg"
                        alt="Coin Icon"
                        width={150}
                        height={150}
                    />
                </div>
                <div className="py-4 text-center">
                    <p>You are running low on coins. Please purchase more coins to continue using the service.</p>
                    <p className="font-semibold mt-2">Remaining Coins: {userCoins}</p>
                </div>
                <div className="py-4">
                    <CoinPurchaseForm user={user} /> {/* Include purchase form */}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CoinPurchase;
