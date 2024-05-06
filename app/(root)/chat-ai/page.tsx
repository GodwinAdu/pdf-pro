import ConversationWrapper from "@/components/conversation/ConversationWrapper";
import Sidebar from "@/components/sidebar/Sidebar";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const page = async () => {
  const user = await currentUser();
  return (
    <div className="relative overflow-hidden">
      <div className="hidden h-[calc(100vh-3.5rem)] md:flex  md:fixed md:w-72  z-[80] bg-gray-900">
        <div className="w-full">
          <Sidebar />
        </div>
      </div>
      <main className="md:pl-72 inset-y-0 h-[calc(100vh-3.5rem)]">
        <ConversationWrapper id={user?.id} />
      </main>
    </div>
  );
};

export default page;
