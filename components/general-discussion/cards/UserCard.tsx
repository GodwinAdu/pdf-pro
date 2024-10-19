"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
  fullName: string;
  username: string;
  imgUrl: string;
  personType: string;
}

function UserCard({ id, fullName, username, imgUrl, personType }: Props) {
  const router = useRouter();

  const isCommunity = personType === "Community";

  return (
    <article className='flex flex-col justify-between gap-4 max-sm:rounded-xl max-sm:bg-background max-sm:p-4 sm:flex-row sm:items-center'>
      <div className='flex flex-1 items-start justify-start gap-3 xs:items-center'>
        <div className='relative h-12 w-12'>
          <Avatar >
            <AvatarImage src={imgUrl} alt="user_avatar" />
            <AvatarFallback>{fullName[0]}</AvatarFallback>
          </Avatar>
        </div>

        <div className='flex-1 text-ellipsis'>
          <h4 className='font-semibold text-white'>{fullName}</h4>
          <p className='text-xs text-muted-foreground'>@{username}</p>
        </div>
      </div>

      <Button
        className=' h-auto min-w-[74px] rounded-lg bg-green-500 text-[12px] text-light-1 !important'
        onClick={() => {
          if (isCommunity) {
            router.push(`/communities/${id}`);
          } else {
            router.push(`/profile/${id}`);
          }
        }}
      >
        View
      </Button>
    </article>
  );
}

export default UserCard;
