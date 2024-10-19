"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    memberId: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    amount: z.number(),
})


const TransferForm = () => {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            memberId: "",
            amount: 0
        },
    });

    const { isSubmitting } = form.formState;

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    };
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="memberId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter Reciever Username</FormLabel>
                            <FormControl>
                                <Input placeholder="Receiver username" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Enter Amount to Transfer </FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="Amount to Transfer" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button disabled={isSubmitting} type="submit">
                    {isSubmitting ? "Transfering..." : "Transfer"}
                </Button>
            </form>
        </Form>
    )
}

export default TransferForm