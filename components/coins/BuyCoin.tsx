"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import Image from 'next/image';
import CoinPurchaseForm from './CoinPurchaseForm';
import { Button } from '../ui/button';

const BuyCoin = ({ user }) => {
    const [open, setOpen] = useState(false); // State to manage dialog open/close

    const handleCloseDialog = () => {
        setOpen(false); // Function to close dialog
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">Buy Coins</Button>
            </DialogTrigger>
            <DialogContent className="w-[96%] max-w-xl">
                <div className="mx-auto">
                    <Image
                        src="/icons/coin.svg"
                        alt="Avatar"
                        width={150}
                        height={150}
                    />
                </div>
                <div className="py-4 px-4">
                    <CoinPurchaseForm user={user} handleCloseDialog={handleCloseDialog} /> {/* Pass close function */}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BuyCoin;
