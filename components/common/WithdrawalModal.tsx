import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import PlaceWithdrawForm from "./PlaceWithdrawForm"



export function WithdrawModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-700">Place Withdrawal</Button>
      </DialogTrigger>
      <DialogContent className="w-[96%] max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
        </DialogHeader>
        <div className="">
            <PlaceWithdrawForm />
        </div>
       
      </DialogContent>
    </Dialog>
  )
}