import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import TransferForm from "./TransferForm"

export function TransferModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-500 hover:bg-blue-700">P2P</Button>
      </DialogTrigger>
      <DialogContent className="w-[96%] max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Transfer Coin</DialogTitle>
          <DialogDescription>
            Add friend username and the amount to transfer to them.
          </DialogDescription>
        </DialogHeader>
        <TransferForm />
      </DialogContent>
    </Dialog>
  )
}