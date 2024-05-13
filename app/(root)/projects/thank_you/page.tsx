"use client"

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { Loader2 } from 'lucide-react';

const Page = () => {
    const router = useRouter();
    const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });

    const detectSize = () => {
        setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            detectSize();
            window.addEventListener('resize', detectSize);
            return () => {
                window.removeEventListener('resize', detectSize);
            };
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/projects');
        }, 30000);

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <>
            {typeof window !== 'undefined' && (
                <Confetti
                    width={windowDimension.width}
                    height={windowDimension.height}
                // tweenDuration={100}
                />
            )}
            <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex flex-col justify-center items-center px-2">

                <div className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg">
                    <h1 className="md:text-3xl text-xl font-bold mb-6 text-center text-gray-800">Woohoo! Payment completed</h1>
                    <p className="md:text-lg text-md text-gray-700 mb-2 text-center">
                        We appreciate your business and are grateful for the opportunity to serve you. Thank you for choosing us!
                    </p>
                    <p className="text-green-500 flex items-center justify-center mb-8">Redirecting back ... <Loader2 className="w-4 h-4 animate-spin ml-2" /></p>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline">
                        Jutech Devs
                    </button>
                </div>
            </div>
        </>
    );
};

export default Page;
