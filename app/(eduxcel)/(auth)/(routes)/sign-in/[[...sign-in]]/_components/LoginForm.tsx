"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { logInUser } from "@/lib/actions/signup-actions"
import { useRouter, useSearchParams } from "next/navigation"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { useState } from "react"
import Link from "next/link"


const formSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})
const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false)

    const searchParams = useSearchParams();
    const router = useRouter()
    const origin = searchParams?.get("origin");
    console.log(origin, "search origin: ")

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });


    const handleRedirect = async (origin: string | null | undefined) => {
        // If no origin is provided, redirect to home
        if (!origin) {
            return router.push('/');
        }
    
        const decodedOrigin = decodeURIComponent(origin);
    
        // If the origin is a valid relative path, handle accordingly
        if (decodedOrigin.startsWith('/')) {
            // Prevent redirect to login page if already logged in
            if (decodedOrigin.includes('/login')) {
                return router.push('/');
            }
    
            // Redirect to the decoded origin
            return router.push(decodedOrigin);
        }
    
        // Fallback to home for any non-relative or unsafe origin
        return router.push('/');
    };
    

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await logInUser(values);
            // Redirect the user to the origin or home
            await handleRedirect(origin);
            toast({
                title: "Success",
                description: "Logged in successfully",
            })
        } catch (error) {

            toast({
                title: "Something went wrong",
                description: "Email or Password is invalid",
                variant: "destructive",
            })
        } finally {
            form.reset();
        }
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Enter email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"} // Toggle password visibility
                                            placeholder="Enter password"
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
                                    <Link
                                        href="/forgot-password"
                                        className="text-sm underline flex justify-end"
                                    >
                                        Forgot your password?
                                    </Link>
                                </>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <Button className="w-full" type="submit">Submit</Button>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href={`/sign-up?origin=${encodeURIComponent(origin || '/sign-in')}`}>
                       <span className="text-blue-500 underline">Sign up</span>  here
                    </Link>
                </div>
            </form>
        </Form>
    )
}

export default LoginForm
