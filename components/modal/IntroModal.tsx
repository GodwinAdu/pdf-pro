"use client"

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const IntroModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const modalKey = "introModal";
    const lastOpenedKey = "lastOpenedTime";
    const tenHoursInMilliseconds = 10 * 60 * 60 * 1000;

    // Check if the modal has been opened before
    const hasModalBeenOpenedBefore = localStorage.getItem(modalKey) === "true";

    if (!hasModalBeenOpenedBefore) {
      // Set a timeout to open the modal after 5 seconds (5000 milliseconds)
      const timeoutId = setTimeout(() => {
        setIsOpen(true);
        // Save the modal open flag and current time in localStorage
        localStorage.setItem(modalKey, "true");
        localStorage.setItem(lastOpenedKey, new Date().getTime().toString());
      }, 5000);

      // Clear the timeout when the component unmounts
      return () => clearTimeout(timeoutId);
    } else {
      // Check if 10 hours have passed since the last opening
      const lastOpenedTime = localStorage.getItem(lastOpenedKey);
      const currentTime = new Date().getTime();

      if (lastOpenedTime && currentTime - parseInt(lastOpenedTime) >= tenHoursInMilliseconds) {
        // More than 10 hours have passed, open the modal again
        setIsOpen(true);
        // Update the last opened time in localStorage
        localStorage.setItem(lastOpenedKey, currentTime.toString());
      }
    }
  }, []); // The empty dependency array ensures this effect runs only once

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[96%] max-w-4xl">
        <DialogHeader>
          <DialogTitle className='font-bold'>Notice !!!.</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@peduarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={closeModal}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IntroModal;
