"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/actions/reset.actions";

// Zod schema with password and confirmPassword
const formSchema = z.object({
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8, {
        message: "Confirm Password must be at least 8 characters.",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // Focus the error on confirmPassword
});

const Page = () => {
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams?.get('token') as string | undefined | null

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    const { isSubmitting } = form.formState;
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await resetPassword(values, token);
            router.push('/sign-in')
            toast({
                title: "Password reset successful",
                description: "You can now log in with your new password.",
            })
        } catch (error) {
            toast({
                title: "Something went wrong",
                description: "Please try again later",
                variant: "destructive"
            })
        }
    }

    return (
        <div className="w-[95%] max-w-lg p-8 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Reset Password
            </h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enter New Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"} // Toggle password visibility
                                            placeholder="Enter new password"
                                            {...field}
                                        />
                                        <span
                                            className="absolute right-2 top-2 cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                                        >
                                            {showPassword ? (
                                                <EyeOffIcon className="w-4 h-4 text-gray-600" />
                                            ) : (
                                                <EyeIcon className="w-4 h-4 text-gray-600" />
                                            )}
                                        </span>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"} // Toggle password visibility
                                            placeholder="Confirm password"
                                            {...field}
                                        />
                                        <span
                                            className="absolute right-2 top-2 cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                                        >
                                            {showPassword ? (
                                                <EyeOffIcon className="w-4 h-4 text-gray-600" />
                                            ) : (
                                                <EyeIcon className="w-4 h-4 text-gray-600" />
                                            )}
                                        </span>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Please wait..." : "Change Password"}
                    </button>
                </form>
            </Form>
        </div>
    );
};

export default Page;
