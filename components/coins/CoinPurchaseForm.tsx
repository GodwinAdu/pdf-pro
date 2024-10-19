"use client";

import { PaystackButton, usePaystackPayment } from "react-paystack";
import React, { useState } from "react";
import ConfettiComponent from "../common/Confetti";
import { toast } from "@/hooks/use-toast";
import { buyCoin } from "@/lib/actions/coin.actions";
import { useRouter } from "next/navigation";

interface PaystackProps { }

const CoinPurchaseForm = ({ user, handleCloseDialog }) => {
    const [selectedAmount, setSelectedAmount] = useState(0);
    const [customAmount, setCustomAmount] = useState<number | null>(null);

    const router = useRouter();

    const amounts = [10, 20, 50, 100];


    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setCustomAmount(value);
        setSelectedAmount(value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const onSuccess = async (reference: any) => {
        console.log(reference,"reference")
        const userId = user._id
        try {
            await buyCoin(userId, reference.reference, selectedAmount);
            router.refresh();
            toast({
                title:"Your purchase was successfully",
                description:"Thank you for trusting in us, Continue use the application"
            })

        } catch (error) {
            toast({
                title: "Something went wrong",
                description: "Please try again later",
                variant: "destructive"
            })
        }
    };

    const onClose = () => {
        return <ConfettiComponent />
    };

    const componentProps = {
        email: user?.email,
        amount: selectedAmount * 100,
        custom_fields: {
            name: user?.fullName,
        },
        currency: process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY!,
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    };
    const initializePayment = usePaystackPayment(componentProps);

    // Disable button logic: disable if no amount selected or custom amount < 10
    const isButtonDisabled = selectedAmount === 0 || (customAmount as number > 0 && customAmount as number < 10);

    return (
        <div className="relative">
            <h2 className="text-2xl font-semibold mb-4 text-center">
                Purchase Coins
            </h2>
            <form onSubmit={handleSubmit} className="">
                <div className="">
                    <p className="mb-2 font-medium">Choose amount to purchase:</p>
                    <div className="flex gap-1 flex-wrap text-center items-center">
                        {amounts.map((amount, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setSelectedAmount(amount)}
                                className={`py-2 focus:outline-none px-3 rounded-md ${index === 0 ? "hidden md:flex" : ""} ${selectedAmount === amount
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-300"
                                    }`}
                            >
                                Gh{amount}
                            </button>
                        ))}

                        <input
                            type="number"
                            min={10}
                            value={customAmount as number}
                            onChange={handleCustomAmountChange}
                            placeholder="Custom"
                            className=" p-2 border rounded-md flex-1"
                        />
                    </div>
                </div>
                <button className={`w-full items-center mt-4 inline-block py-2 px-4 rounded-md transition-colors duration-300 z-50 ${isButtonDisabled
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-green-500 text-white hover:bg-green-700"
                    }`}
                    disabled={isButtonDisabled} onClick={() => {
                        initializePayment({ onSuccess, onClose })
                        handleCloseDialog()
                    }}>
                    Buy Now Gh{selectedAmount}
                </button>

            </form>
        </div>
    );
};

export default CoinPurchaseForm;

//**sk_live_8b5cc782e6c6a8d3de3f69698d93689eee2f35a0