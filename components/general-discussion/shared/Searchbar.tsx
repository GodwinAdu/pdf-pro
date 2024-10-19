"use client";

import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Props {
  routeType: string;
}

function Searchbar({ routeType }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // query after 0.3s of no input
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        router.push(`/general_discussion/${routeType}?q=` + search);
      } else {
        router.push(`/general_discussion/${routeType}`);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, routeType]);

  return (
    <div className='flex gap-1 rounded-lg bg-dark-3 px-4 py-2'>
      <Image
        src='/assets/search-gray.svg'
        alt='search'
        width={24}
        height={24}
        className='object-contain'
      />
      <Input
        id='text'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`${
          routeType !== "/search" ? "Search Friends" : "Search creators"
        }`}
        className='focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 !important border-none bg-black text-base-regular text-white/80 outline-none !important;'
      />
    </div>
  );
}

export default Searchbar;
