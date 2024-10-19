import { redirect } from "next/navigation";


import { ScrollArea } from "@/components/ui/scroll-area";

import { Separator } from "@/components/ui/separator";
import { currentUser } from "@/lib/helpers/current-user";
import { findAllServersByProfileId } from "@/lib/actions/server.actions";
import { NavigationItem } from "./navigation-item";
import { NavigationAction } from "./navigation-action";
import UserAccountNav from "@/components/UserAccountNav";


export const NavigationSidebar = async () => {
  const profile = await currentUser();

  const servers = await findAllServersByProfileId(profile?._id);

  return (
    <div
      className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3"
    >
      <NavigationAction />
      <Separator
        className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
      />
      <ScrollArea className="flex-1 w-full">
        {servers?.map((server) => (
          <div key={server._id} className="mb-4">
            <NavigationItem
              id={server?._id}
              name={server?.name}
              imageUrl={server?.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
        <UserAccountNav user={profile} />
      </div>
    </div>
  )
}