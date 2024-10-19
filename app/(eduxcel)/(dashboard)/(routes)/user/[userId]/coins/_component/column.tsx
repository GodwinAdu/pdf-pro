"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, BadgeAlert, CheckSquare } from "lucide-react";
import { IUser } from "@/lib/models/user.models";
import { CellAction } from "./cell-action";
import moment from "moment";




export const columns: ColumnDef<IUser>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "action",
        header: "Action Type",
        cell: ({ row }) => (
            <div className="">{row.getValue("action")}</div>
        )
    },
    {
        accessorKey: "amount",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Amount Coins
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="">{row.getValue("amount")}</div>,
    },
    {
        accessorKey: "details",
        header: "Details",
        cell: ({ row }) =>
        (
            <div className="text-xs">{row.getValue("details")} </div>
        )

    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) =>
        (
            <div className="text-muted-foreground">{moment(row.original.createdAt).fromNow()} </div>
        )

    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => <CellAction data={row.original} />,
    },
];
