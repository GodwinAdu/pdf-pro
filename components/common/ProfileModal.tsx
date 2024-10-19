import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Laptop, User, User2 } from "lucide-react"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"

export function ProfileModal({user}) {
    return (
        <Dialog >
            <DialogTrigger asChild>
                <button className="flex gap-2 px-2 hover:bg-gray-100 w-full rounded-md py-1"><User className='w-4 h-4 mr-2' />Profile</button>
            </DialogTrigger>
            <DialogContent className="w-[96%] max-w-2xl overflow-y-auto max-h-[90%]">
                <DialogHeader>
                    <DialogTitle className="md:text-2xl font-bold">Account Settings</DialogTitle>
                    <DialogDescription>
                        Manage your account information
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-8">
                    <div className="">
                        <h3 className="font-bold">Profile</h3>
                        <Separator />
                        <div className="py-2 flex justify-between items-center">
                            <div className="flex gap-5 items-center">
                                <Avatar className="md:w-16 md:h-16">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="">
                                    <p className="text-sm font-medium text-black">{user?.fullName}</p>
                                    <p className="text-sm text-muted-foreground">@{user.username}</p>
                                </div>
                            </div>
                            <Badge className="bg-green-500 hover:bg-green-700">verified</Badge>
                        </div>
                    </div>
                    <div className="">
                        <h3 className="font-bold">Email Addresses</h3>
                        <Separator />
                        <div className="py-2">
                            <div className="flex gap-3 text-sm py-3">
                                <p>{user?.email}</p>
                                <Badge>primary</Badge>
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <h3 className="font-bold">Phone Numbers</h3>
                        <Separator />
                        <div className="py-2 pt-2">
                            <p className="text-muted-foreground text-sm">{user?.phone}</p>
                        </div>
                    </div>
                    <div className="">
                        <h3 className="font-bold">Connected Accounts</h3>
                        <Separator />
                        <div className="py-2 flex gap-2 items-center pt-2">
                            <User2 className="w-4 h-4 font-bold" />
                            <p className="font-bold text-sm text-muted-foreground">{user?.username}</p>
                        </div>
                    </div>
                    <div className="py-2">
                        <h3 className="font-bold">Danger Zone</h3>
                        <Separator />
                        <div className="py-2 flex justify-between items-center pt-3">
                            <div className="">
                                <h3 className="font-bold">Delete your account</h3>
                                <p className="text-xs text-muted-foreground">Delete your Account and its all associated data </p>
                            </div>
                            <Button variant="destructive">Delete Account</Button>
                        </div>
                    </div>

                    <div className="py-4">
                        <h2 className="text-2xl font-bold">Beta Features</h2>
                        <p>New features now accessible through our exclusive beta program.</p>
                        <Separator />

                        <p className="text-muted-foreground text-sm py-3">No beta features are currently available at the moment</p>
                    </div>

                    <div className="py-4">
                        <h2 className="text-2xl font-bold">Security</h2>
                        <p>Manage your security preferences</p>
                        <Separator />
                        <div className="py-4 flex gap-4 items-center">
                            <Laptop className="w-8 h-8" />
                            <p>Not yet found</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
