
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


import Link from "next/link"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "@/hooks/use-toast"
import { createUser } from "@/lib/actions/signup-actions"
import { useRouter, useSearchParams } from "next/navigation"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { ChangeEvent, useState } from "react"
import { useUploadThing } from "@/lib/uploadthing"
import { isBase64Image } from "@/lib/utils"
import Image from "next/image"

const formSchema = z.object({
    imageUrl: z.string().optional(),
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    fullName: z.string().min(2, {
        message: "Full Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
        message: "Phone number must be at least 10 digits.",
    }),
    password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
    }),
})

const page = () => {
    const [showPassword, setShowPassword] = useState(false)
    const searchParams = useSearchParams();
    const router = useRouter()
    const origin = searchParams?.get("origin");
    const referral = searchParams?.get("referral");
    const { startUpload } = useUploadThing("media");
    const [files, setFiles] = useState<File[]>([]);
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            fullName: "",
            phone: "",
            email: "",
            password: "",
        },
    });

    const { isSubmitting } = form.formState;

    const handleRedirect = async (origin: string | null | undefined) => {
        // If no origin is provided, redirect to home
        if (!origin) {
            return router.push('/sign-in');
        }

        const decodedOrigin = decodeURIComponent(origin);

        // If the origin is a valid relative path, handle accordingly
        if (decodedOrigin.startsWith('/')) {
            // Prevent redirect to login page if already logged in
            if (decodedOrigin.includes('/login')) {
                return router.push('/sign-in');
            }

            // Redirect to the decoded origin
            return router.push(decodedOrigin);
        }

        // Fallback to home for any non-relative or unsafe origin
        return router.push('/');
    };

    const handleImage = (
        e: ChangeEvent<HTMLInputElement>,
        fieldChange: (value: string) => void
    ) => {
        e.preventDefault();

        const fileReader = new FileReader();

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFiles(Array.from(e.target.files));

            if (!file.type.includes("image")) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || "";
                fieldChange(imageDataUrl);
            };

            fileReader.readAsDataURL(file);
        }
    };

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const blob = values.imageUrl;

            const hasImageChanged = isBase64Image(blob as string);
            if (hasImageChanged) {
                const imgRes = await startUpload(files);

                if (imgRes && imgRes[0].url) {
                    values.imageUrl = imgRes[0].url;
                }
            }
            await createUser(values, referral,origin)
            if (origin) {
                await handleRedirect(origin)
            }

            if (referral) (
                router.push('/sign-in')
            )

            toast({
                title: "Success",
                description: "Account created successfully",
            })

        } catch (error) {
            toast({
                title: "Something went wrong",
                description: "Email or Password is invalid",
                variant: "destructive",
            })
        } finally {
            form.reset()
        }
    }

    return (
        <Card className="mx-auto w-[96%] max-w-xl max-h-[90%] overflow-y-auto">
            <CardHeader>
                <CardTitle className="text-xl">Sign Up  &gt;&gt;<span className="text-gradient">EduxcelMaster</span></CardTitle>
                <CardDescription>
                    Enter your information to create an account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name='imageUrl'
                                render={({ field }) => (
                                    <FormItem className='flex items-center gap-4'>
                                        <FormLabel className='flex h-24 w-24 items-center justify-center rounded-full bg-black/50 !important;'>
                                            {field.value ? (
                                                <Image
                                                    src={field.value}
                                                    alt='profile_icon'
                                                    width={96}
                                                    height={96}
                                                    priority
                                                    className='rounded-full object-fit'
                                                />
                                            ) : (
                                                <Image
                                                    src='/assets/user.svg'
                                                    alt='profile_icon'
                                                    width={24}
                                                    height={24}
                                                    className='object-contain'
                                                />
                                            )}
                                        </FormLabel>
                                        <FormControl className='flex-1 text-base-semibold text-gray-200'>
                                            <Input
                                                type='file'
                                                accept='image/*'
                                                placeholder='Add profile photo'
                                                className='cursor-pointer border-none bg-transparent outline-none file:text-blue-500 !important'
                                                onChange={(e) => handleImage(e, field.onChange)}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Eg. Jutech" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Eg. John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email Address</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="Eg. hello@mywife.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Phone Number</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+233 555 ********" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter Password</FormLabel>
                                        <FormControl>
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
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button disabled={isSubmitting} type="submit" className="w-full">
                                {isSubmitting ? "Please wait..." : "Create an account"}
                            </Button>
                            <div className="mt-4 text-center text-sm">
                                Already have an account?{" "}
                                <Link href={`/sign-in?origin=${encodeURIComponent(origin || '/')}`} className="underline text-blue-500">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>
    )
}

export default page
