"use client";

import { useState } from "react";
import {  Edit, Eye, MoreHorizontal, TimerReset, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IUser } from "@/lib/models/user.models";

interface CellActionProps {
  data:IUser;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const params = useParams();
  

//   const handleDeleteUser = async (id:string) => {
//     try {
//       setLoading(true);
//       await deleteUser({id})
//       toast({
//         title: "Deleted Successfully",
//         description: "Please User was deleted successfully...",
       
//       });
//       router.refresh();
//     } catch (error) {
//       toast({
//         title: "Something Went Wrong",
//         description: "Please try again later",
//         variant: "destructive",
//       });
//     } finally {
//       setOpen(false);
//       setLoading(false);
//     }
//   };



  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4 text-green-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <Link href={`/dashboard/manage-users/${data._id}`}>
              <DropdownMenuItem >
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            </Link>
           
             <DropdownMenuItem >
              <Edit className="mr-2 h-4 w-4" /> Update
            </DropdownMenuItem>
             <DropdownMenuItem onClick=''>
              <TimerReset className="mr-2 h-4 w-4" /> Reset
            </DropdownMenuItem>
          
            <DropdownMenuItem onClick=''>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
