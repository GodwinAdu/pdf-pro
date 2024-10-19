"use client";

import React, { useState } from "react";
import {
  ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users
} from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";
import { MemberRole } from "@/lib/models/member.models";

export const ServerHeader = ({ server, role }: { server: any; role: any }) => {
  const { onOpen } = useModal();
  const [isOpen, setIsOpen] = useState(false);

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative bg-white w-full">
      <button
        onClick={toggleDropdown}
        className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
      >
        {server.name}
        <ChevronDown className="h-5 w-5 ml-auto transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
      </button>
      
      {isOpen && (
        <div className="absolute w-full z-50 shadow-lg text-xs font-medium text-black dark:text-neutral-400 bg-white dark:bg-neutral-800  rounded-lg mt-0 space-y-2">
          {isModerator && (
            <div
              onClick={() => {
                onOpen("invite", { server });
                toggleDropdown();
              }}
              className="text-indigo-600 flex justify-between items-center dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
            >
              Invite People
              <UserPlus className="h-4 w-4 " />
            </div>
          )}
          {isAdmin && (
            <>
              <div
                onClick={() => {
                  onOpen("editServer", { server });
                  toggleDropdown();
                }}
                className="px-3 flex justify-between items-center py-2 text-sm cursor-pointer hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
              >
                Server Settings
                <Settings className="h-4 w-4" />
              </div>
              <div
                onClick={() => {
                  onOpen("members", { server });
                  toggleDropdown();
                }}
                className="px-3 flex justify-between items-center py-2 text-sm cursor-pointer hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
              >
                Manage Members
                <Users className="h-4 w-4 " />
              </div>
            </>
          )}
          {isModerator && (
            <div
              onClick={() => {
                onOpen("createChannel");
                toggleDropdown();
              }}
              className="px-3 flex justify-between items-center py-2 text-sm cursor-pointer hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
            >
              Create Channel
              <PlusCircle className="h-4 w-4 " />
            </div>
          )}
          {isModerator && <hr className="border-neutral-200 dark:border-neutral-800" />}
          {isAdmin && (
            <div
              onClick={() => {
                onOpen("deleteServer", { server });
                toggleDropdown();
              }}
              className="text-rose-500 px-3 flex justify-between items-center py-2 text-sm cursor-pointer hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
            >
              Delete Server
              <Trash className="h-4 w-4" />
            </div>
          )}
          {!isAdmin && (
            <div
              onClick={() => {
                onOpen("leaveServer", { server });
                toggleDropdown();
              }}
              className="text-rose-500 px-3 flex justify-between items-center py-2 text-sm cursor-pointer hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50"
            >
              Leave Server
              <LogOut className="h-4 w-4 " />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
