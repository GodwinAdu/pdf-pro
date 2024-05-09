"use client"

import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const page = () => {
    const router = useRouter()
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/projects');
        }, 30000);

        return () => clearTimeout(timer);
    }, [router]);
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 to-indigo-600 flex flex-col justify-center items-center px-2">
            <div className="max-w-lg mx-auto bg-white p-8 shadow-lg rounded-lg">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Thank You!</h1>
                <p className="text-lg text-gray-700 mb-8 text-center">
                    We appreciate your business and are grateful for the opportunity to serve you. Thank you for choosing us!
                </p>
                <button className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline">
                    Jutech Devs
                </button>
            </div>
        </div>
    )
}

export default page
