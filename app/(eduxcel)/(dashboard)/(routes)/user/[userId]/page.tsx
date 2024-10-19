import * as React from "react";
import Link from "next/link";
import { ArrowRightCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

const page = () => {
  return (
    <main className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 py-8 px-6 bg-gray-100 min-h-screen">
      {/* Left Column - Challenges */}
      <div className="flex flex-col gap-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl lg:text-2xl font-semibold">Bi-Weekly Trail Joined</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 items-center">
              <span className="text-2xl md:text-3xl lg:text-4xl font-bold">0</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-gradient-to-r from-blue-500 via-green-500 to-teal-400 text-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl lg:text-2xl font-semibold">Weekly Trails Joined</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 items-center">
              <span className="text-2xl md:text-3xl lg:text-4xl font-bold">0</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Coins & Stats */}
      <div className="col-span-3 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl md:text-2xl lg:text-3xl font-semibold">Total Coins</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-5 justify-between px-8 items-center">
              <Image
                src={`/icons/coin.svg`}
                alt="coin image"
                width={52}
                height={52}
              />
              <span className="text-2xl md:text-3xl lg:text-4xl font-bold">0</span>
            </CardContent>
            <CardFooter>
              <Link href="#" className="text-sm md:text-base flex gap-1 items-center hover:text-blue-200">
                View All <ArrowRightCircle className="w-5 h-5" />
              </Link>
            </CardFooter>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-gradient-to-r from-green-400 via-teal-500 to-cyan-600 text-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl md:text-2xl lg:text-3xl font-semibold flex justify-between items-center">
                Coin Used <span className="text-xs lg:text-sm">This month</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-5 justify-between px-8 items-center">
              <Image
                src={`/icons/coin.svg`}
                alt="coin image"
                width={52}
                height={52}
              />
              <span className="text-2xl md:text-3xl lg:text-4xl font-bold">0</span>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl lg:text-3xl font-semibold flex justify-between items-center">
                Coin Shared <span className="text-xs lg:text-sm">This month</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-5 justify-between px-8 items-center">
              <Image
                src={`/icons/coin.svg`}
                alt="coin image"
                width={52}
                height={52}
              />
              <span className="text-2xl md:text-3xl lg:text-4xl font-bold">0</span>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg md:text-xl lg:text-2xl font-semibold">Leaderboard Position</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-center">
                <span className="text-2xl md:text-3xl lg:text-4xl font-bold">0</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-gradient-to-r from-teal-400 via-green-500 to-lime-500 text-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg md:text-xl lg:text-2xl font-semibold">Problems Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-center">
                <span className="text-2xl md:text-3xl lg:text-4xl font-bold">0</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-500 text-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg md:text-xl lg:text-2xl font-semibold">Total Study Battles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 items-center">
                <span className="text-2xl md:text-3xl lg:text-4xl font-bold">0</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default page;
