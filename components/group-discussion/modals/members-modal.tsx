"use client";

import axios from "axios";
import qs from "query-string";
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion
} from "lucide-react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar } from "../user-avatar";
import { MemberRole } from "@/lib/models/member.models";
import { kickMemberFromServer, updateMemberWithRole } from "@/lib/actions/user.actions";
import { toast } from "@/hooks/use-toast";

const roleIconMap = {
  "GUEST": null,
  "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500" />
}

export const MembersModal = () => {
  const router = useRouter();
  const params = useParams();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const isModalOpen = isOpen && type === "members";
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const serverId = params?.serverId as string;

  const onKick = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const response = await kickMemberFromServer(serverId, memberId)

      toast({
        title: "Member kicked",
        description: "Member kicked successfully"
      })
      onOpen("members", { server: response });
      router.refresh();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setLoadingId("");
    }
  }

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const response = await updateMemberWithRole({ serverId, memberId, role });
      toast({
        title: "Member role updated",
        description: "Member role updated successfully"
      })
      onOpen("members", { server: response });
      router.refresh();
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive"
      })
    } finally {
      setLoadingId("");
    }
  }

  const handleOnclose = () =>{
    onClose();
    router.refresh();
  }


  return (
    <Dialog open={isModalOpen} onOpenChange={handleOnclose}>
      <DialogContent className="bg-white text-black overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Manage Members
          </DialogTitle>
          <DialogDescription
            className="text-center text-zinc-500"
          >
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-8 max-h-[420px] pr-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.userId.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.userId.fullName}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">
                  {member.userId.email}
                </p>
              </div>
              {server.userId !== member.userId && loadingId !== member._id && (
                <div className="ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical className="h-4 w-4 text-zinc-500" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger
                          className="flex items-center"
                        >
                          <ShieldQuestion
                            className="w-4 h-4 mr-2"
                          />
                          <span>Role</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member._id, "GUEST")}
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              Guest
                              {member.role === "GUEST" && (
                                <Check
                                  className="h-4 w-4 ml-auto"
                                />
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onRoleChange(member._id, "MODERATOR")}
                            >
                              <ShieldCheck className="h-4 w-4 mr-2" />
                              Moderator
                              {member.role === "MODERATOR" && (
                                <Check
                                  className="h-4 w-4 ml-auto"
                                />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onKick(member._id)}
                      >
                        <Gavel className="h-4 w-4 mr-2" />
                        Kick
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
              {loadingId === member._id && (
                <Loader2
                  className="animate-spin text-zinc-500 ml-auto w-4 h-4"
                />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}