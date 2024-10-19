"use client";

import qs from "query-string";
import axios from "axios";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { deleteChannel } from "@/lib/actions/channel.actions";
import { toast } from "@/hooks/use-toast";

export const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const pathname = usePathname()

  const isModalOpen = isOpen && type === "deleteChannel";
  const { server, channel } = data;

  const serverId = server?._id;
  const channelId = channel?._id;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      await deleteChannel(serverId,channelId)
     
      toast({
        title:"Delete Channel",
        description:"Deleted channel successfully"
      })
  
    } catch (error) {
      toast({
        title:"Something went wrong",
        description:"Please try again later",
        variant:"destructive"
      })
    } finally {
      setIsLoading(false);
      onClose()
      router.refresh();
    }
  }

  const handleOnclose = () =>{
    onClose();
    router.refresh();
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOnclose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Delete Channel
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            <span className="text-indigo-500 font-semibold">#{channel?.name}</span> will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isLoading}
              onClick={onClose}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={onClick}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}