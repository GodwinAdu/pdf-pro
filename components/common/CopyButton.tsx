"use client"

import { Check, Copy } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const CopyButton = ({
    value,
    type
}: {
    value: string;
    type: string;
}) => {
    const [copied, setCopied] = useState<boolean>(false);

    // Function to copy values to clipboard
    function copyValue() {
        navigator.clipboard.writeText(value);
        setCopied(true);
        toast({
            title: `Link Copied ${type === "invite" ? "Invite" : "ID"}`,
        });
        setTimeout(() => {
            setCopied(false);
        }, 3000); // Revert to original state after 3 seconds
    }
    return (
        <button
            type='button'
            onClick={copyValue}
            className={`${copied ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"} text-white p-1 rounded-lg transition duration-300 ease-in-out`}
        >
            {copied ? <Check className='w-4 h-4' /> : <Copy className='w-4 h-4' />}
        </button>
    );
};

export default CopyButton;