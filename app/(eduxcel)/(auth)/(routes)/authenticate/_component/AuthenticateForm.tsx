"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { verifyOtp, resendOtp } from "@/lib/actions/otp.actions"; // Assuming resendOtp action exists
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react"; // Import useState

const formSchema = z.object({
    pin: z.string().min(7, {
        message: "Your one-time password must be 7 characters.",
    }),
});

const AuthenticateForm = ({ user }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const origin = searchParams?.get("origin");
    const otpSentOnce = useRef(false); // Ref to ensure OTP is sent only once
    const [otpGenerated, setOtpGenerated] = useState(false); // Track OTP state
    const [isResending, setIsResending] = useState(false); // Track if resending OTP
    const [isOtpSent, setIsOtpSent] = useState(false); // Track if

    // Form setup
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            pin: "",
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
            // Redirect to the decoded origin
            return router.push(decodedOrigin);
        }

        // Fallback to home for any non-relative or unsafe origin
        return router.push('/');
    };



    // Submit handler for OTP verification
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const otp = values.pin;
            await verifyOtp(otp);

            await handleRedirect(origin); // Redirect to the next AuthenticateForm if OTP is valid
            toast({
                title: "Email verified successfully",
                description: "You can now proceed with the application. Thank you",
            });
        } catch (error) {
            toast({
                title: "Something went wrong",
                description: "Invalid PIN",
                variant: "destructive",
            });
        } finally {
            form.reset();
        }
    }

    // Handler for resending OTP
    const handleResendOtp = async () => {
        try {
            setIsResending(true);
            const data = await resendOtp(); // Trigger OTP resend

            if (data.otp) {
                setIsOtpSent(true); // Update to show "Verified"
            }

            toast({
                title: "OTP resent successfully",
                description: "A new OTP has been sent to your phone.",
            });
            setOtpGenerated(true); // Update to show "Resend OTP"
        } catch (error) {
            toast({
                title: "Error resending OTP",
                description: "An error occurred while resending the OTP.",
                variant: "destructive",
            });
        } finally {
            setIsResending(false);
        }
    };


    useEffect(() => {
        if (!otpGenerated && !otpSentOnce.current) {
            handleResendOtp();
            otpSentOnce.current = true; // Prevent further OTP resends
        }
    }, [otpGenerated]); // Only run when otpGenerated changes

    return (
        <div className="w-[95%] max-w-lg p-8 bg-white shadow-lg rounded-lg">
            {isOtpSent && (
                <div className="py-6 ">
                    <p className="text-xs italic text-center">An OTP code has been sent to <span className="text-blue-500 underline">{user?.email}</span>. Please check your inbox to proceed.</p>
                </div>
            )}
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Verify Email</h2>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="pin"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>One-Time Password</FormLabel>
                                <FormControl>
                                    <InputOTP maxLength={7} className="w-full" {...field}>
                                        <InputOTPGroup>
                                            <InputOTPSlot index={0} />
                                            <InputOTPSlot index={1} />
                                            <InputOTPSlot index={2} />
                                            <InputOTPSlot index={3} />
                                            <InputOTPSlot index={4} />
                                            <InputOTPSlot index={5} />
                                            <InputOTPSlot index={6} />
                                        </InputOTPGroup>
                                    </InputOTP>
                                </FormControl>
                                <FormDescription>
                                    Please enter the one-time password sent to your phone.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                    >
                        Submit OTP
                    </button>
                    <p className="text-gray-500 mt-1 text-sm">
                        Didn't receive the code?{" "}
                        <button
                            type="button"
                            className="text-indigo-600 hover:underline"
                            onClick={handleResendOtp}
                            disabled={isResending}
                        >
                            {otpGenerated ? "Resend OTP" : "Generate OTP"}
                        </button>
                    </p>
                </form>
            </Form>
        </div>
    );
};

export default AuthenticateForm;
