
import React from 'react';
import { ServerSidebar } from "@/components/group-discussion/server/server-sidebar";
import { findServerWithMembersByProfileId } from "@/lib/actions/server.actions";
import { currentUser } from "@/lib/helpers/current-user";
import { redirect } from "next/navigation";


const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const user = await currentUser();
  console.log(params.serverId, "params serverId")


  const server = await findServerWithMembersByProfileId(params.serverId, user?._id)


  if (!server) {
    return redirect("/group_discussion");
  }

  return (
    <div className="h-screen">
      <div
        className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <main className="h-full md:pl-60">
        {children}
      </main>
    </div>
  );
}

export default ServerIdLayout;