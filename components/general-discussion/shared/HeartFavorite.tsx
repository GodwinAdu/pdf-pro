"use client"
import { useState } from "react";
import { AddToLike } from "@/lib/actions/user.actions";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";
import clsx from 'clsx'; // For conditional class handling
import { useRouter } from "next/navigation";

interface HeartFavoriteProps {
    thread: any;
    userId: string;
}

const HeartFavorite = ({ thread, userId }: HeartFavoriteProps) => {
    const [isLiked, setIsLiked] = useState(thread?.likes.includes(userId));
    const [isAnimating, setIsAnimating] = useState(false); // For triggering animation
    const router = useRouter()

    const handleLike = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setIsAnimating(true); // Start the animation

        try {
            const updatedThread = await AddToLike(thread._id);
            setIsLiked(updatedThread.likes.includes(userId)); // Real-time update
            router.refresh();
        } catch (err) {
            console.log("[wishlist_POST]", err);
            toast({
                title: "Something went wrong",
                description: "Please reload to fetch Menu",
                variant: "destructive"
            });
        } finally {
            setTimeout(() => setIsAnimating(false), 1000); // End animation after 1s
        }
    };

    return (
        <div className="relative group"> {/* Tooltip container */}
            <button
                onClick={handleLike}
                className={clsx("focus:outline-none flex gap-1 items-center", {
                    "animate-ping-once": isAnimating, // Conditional animation class
                })}
            >
                {isLiked ? (
                    <Image
                        src='/assets/heart-filled.svg'
                        alt='heart'
                        width={24}
                        height={24}
                        className='cursor-pointer object-contain'
                    />
                ) : (
                    <Image
                        src='/assets/heart-gray.svg'
                        alt='heart'
                        width={24}
                        height={24}
                        className='cursor-pointer object-contain'
                    />
                )}
                <p className="text-xs">{thread.likes.length}</p>
            </button>

            {/* Tooltip */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gray-800 text-white text-xs rounded-md py-1 px-2 pointer-events-none">
                {isLiked ? "Unlike" : "Like"} {/* Tooltip text changes based on state */}
            </div>

            {/* Heart Sprinkle Animation */}
            {isAnimating && (
                <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
                    <div className="relative">
                        {/* Animated hearts */}
                        <div className="absolute bg-pink-400 h-4 w-4 rounded-full animate-heart-sprinkle-1"></div>
                        <div className="absolute bg-pink-500 h-5 w-5 rounded-full animate-heart-sprinkle-2"></div>
                        <div className="absolute bg-pink-300 h-3 w-3 rounded-full animate-heart-sprinkle-3"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeartFavorite;
