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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Settings } from "lucide-react";
import { ModeToggle } from "./mode/ModeToggle";
import { Separator } from "./ui/separator";

export function Setting() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="flex gap-4 cursor-pointer ml-3">
          <Settings /> Settings
        </p>
      </DialogTrigger>
      <DialogContent className="w-[96%] max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Settings</DialogTitle>
          <DialogDescription>
            You can manage the Account,theme and delete your chat with SummaQ AI.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="">
          <div className="flex justify-between items-center py-3">
            <p className="font-bold">Theme</p>
            <ModeToggle />
          </div>
          <Separator />
          <div className="flex justify-between items-center py-3">
            <p className="font-bold">Clear all chat with AI</p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button variant="destructive">Continue</Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <Separator />
        <DialogFooter>
        <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button variant="destructive">Continue</Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
