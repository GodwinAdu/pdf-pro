'use client'

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { ArrowRight, MoreHorizontal, Plus, Settings, Trash2 } from "lucide-react";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import React, { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { Badge } from "../ui/badge";
import { ChangeEmailForm } from "./ChangeEmailForm";

export function ManageAccount() {
    const [isOpen, setIsOpen] = useState(false);
    const [isEmailOpen, setIsEmailOpen] = useState(false);
    const [profileImage, setProfileImage] = useState<string>('');

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            console.log('Form Data:', formData.values());

            // Replace with your API endpoint to handle image uploads
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setProfileImage(data.imageUrl); // Assume your API returns the URL of the uploaded image
            } else {
                console.error('Failed to upload image');
            }
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button
                    className="w-full px-4 py-3 border-b text-sm text-gray-700 hover:bg-gray-100 flex gap-4 items-center shadow-sm"
                    id="user-menu-item-1"
                    type='button'
                >
                    <Settings className="h-4 w-4" />
                    Manage account
                </button>
            </DialogTrigger>
            <DialogContent className="w-[96%] max-w-3xl">
                <Tabs defaultValue="profile" className="">
                    <TabsList className="px-2">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile" className="w-full">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-extrabold">Profile details</CardTitle>
                            </CardHeader>
                            <Separator />
                            <CardContent className="space-y-2">
                                <div className="">
                                    <div
                                        className=" cursor-pointer grid grid-cols-1 md:grid-cols-3 gap-5 rounded-lg bg-gray-50 p-4 text-gray-900"
                                    >
                                        <div className="flex col-span-2 gap-5 items-center">
                                            <p className="text-xs md:text-lg">Profile</p>
                                            <div className=" text-sm text-gray-700 flex items-center gap-2 ">
                                                <Avatar>
                                                    <AvatarImage src={profileImage} alt="Profile Image" />
                                                    <AvatarFallback>GA</AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-1">
                                                    <p className="text-xm text-gray-700 font-bold">
                                                        Godwin Adu
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Button onClick={() => setIsOpen(true)} className="shrink-0 transition duration-300 group-open:-rotate-180" type="button" variant="outline" size="sm">Update image</Button>
                                    </div>

                                    {isOpen && (
                                        <div className="py-4">
                                            <Card className=" w-[95%] px-2 md:px-4 py-2">
                                                <CardContent className="w-full">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                                                        <div className=" px-4 py-4  text-sm text-gray-700 flex items-center gap-4 w-full col-span-2">
                                                            <div className="">
                                                                <Avatar className="w-10 h-10 md:w-32 md:h-32 sm:h-16 sm:w-16">
                                                                    <AvatarImage src="" alt="@shadcn" />
                                                                    <AvatarFallback>GA</AvatarFallback>
                                                                </Avatar>
                                                            </div>
                                                            <div className="space-y-1 w-full">
                                                                <p className="text-xs md:text-sm text-gray-700 font-bold">
                                                                    Godwin Adu Jr
                                                                </p>
                                                            </div>

                                                        </div>
                                                        <UploadButton
                                                                appearance={{
                                                                    button:
                                                                      "px-4 border-2 border-black ut-ready:bg-green-500 ut-uploading:cursor-not-allowed rounded-r-none bg-blue-500 bg-none after:bg-orange-400",
                                                                  }}
                                                            className="text-xs"
                                                            endpoint="imageUploader"
                                                            onClientUploadComplete={(res) => {
                                                                // Do something with the response
                                                                console.log("Files: ", res);
                                                                alert("Upload Completed");
                                                            }}
                                                            onUploadError={(error: Error) => {
                                                                // Do something with the error.
                                                                alert(`ERROR! ${error.message}`);
                                                            }}
                                                        />
                                                    </div>
                                                </CardContent>
                                                <CardFooter className="relative">
                                                    <div className="flex items-end gap-4 absolute right-3">
                                                        <Button onClick={() => setIsOpen(false)} variant="destructive" size="sm">Cancel</Button>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                        </div>
                                    )}
                                    <Separator className="my-4" />
                                    <div className="flex md:flex-row flex-col justify-between items-center">
                                        <h3 className="font-extrabold hidden md:block">Email Address</h3>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex gap-1">
                                                <p className="text-xm text-gray-500">gyamfiadu01@gmail.com</p>
                                                <Badge className="text-xs" variant="outline">Primary</Badge>
                                            </div>
                                            <Button className="text-xs" onClick={()=>setIsEmailOpen(true)} variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Change Email Address <ArrowRight className="w-4 h-4 ml-2" /></Button>
                                        </div>
                                        <Button  variant="destructive" size="icon"><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                    {isEmailOpen && (
                                        <div className="py-4">
                                            <Card className=" w-[95%] px-2 md:px-4 py-2">
                                                <CardContent className="">
                                                    <ChangeEmailForm />
                                                </CardContent>
                                                <CardFooter className="relative">
                                                    <div className="flex items-end gap-4 absolute right-3">
                                                        <Button onClick={() => setIsEmailOpen(false)} variant="destructive" size="sm">Cancel</Button>
                                                    </div>
                                                </CardFooter>
                                            </Card>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-extrabold">Security</CardTitle>
                            </CardHeader>
                            <Separator />
                            <CardContent className="space-y-2">
                                {/* Security content goes here */}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
