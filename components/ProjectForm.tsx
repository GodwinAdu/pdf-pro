"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as z from 'zod'
import { Textarea } from "@/components/ui/textarea"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { usePathname, useRouter } from "next/navigation"
import { projectDefaultValues } from "@/lib/constants"
import { IAssignment } from "@/lib/models/Assignment.models"
import { postAssignment, updateAssignment } from "@/lib/actions/assignment.actions"
import { toast } from "./ui/use-toast"
import { getPrice } from "@/lib/utils"

const FormSchema = z.object({
    fullname: z
        .string().min(2, {
            message: "Please full name is required",
        }),
    email: z
        .string({
            message: "Please email is required",
        })
        .email(),
    phone: z
        .string().min(2, {
            message: "Please phone number is required",
        }),
    question: z
        .string().min(2, {
            message: "Please question is required",
        }),
    description: z
        .string().optional(),
    problemType: z
        .string().min(2, {
            message: "Please select a problem type.",
        }),
    deadline: z
        .date({
            message: "Please deadline date required",
        }),
})

interface ProjectFormProps {
    type: string;
    data?: IAssignment
}


const ProjectForm = ({ type, data }: ProjectFormProps) => {

    const router = useRouter();
    const path = usePathname();

    const assignmentId = data?._id as string

    const initialValues = data && type === 'Update'
        ? {
            ...data,
            deadline: new Date(data?.deadline)
        } : projectDefaultValues;


    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialValues
    })


    const priceToPay = form.watch('problemType');

    const proceed =
        (form.watch("fullname") === "") ||
        (form.watch("email") === "") ||
        (form.watch("phone") === "") ||
        (form.watch("question") === "") ||
        (form.watch("problemType") === "");


    async function onSubmit(values: z.infer<typeof FormSchema>) {
        if (type === "Create") {
            try {
                await postAssignment(values, path)
                router.push("/projects")
                toast({
                    title: "Assignment submitted",
                    description: "Your project was sent successfully",
                    variant: "success"
                })

            } catch (error) {
                console.log("something went wrong");
                toast({
                    title: "Something went wrong",
                    description: "Please try again later",
                    variant: "destructive"
                })
            }
        }
        if (type === "Update") {
            try {
                await updateAssignment(assignmentId, values, path)
                router.push("/projects")
                toast({
                    title: "Assignment submitted",
                    description: "Your project was sent successfully",
                    variant: "success"
                })

            } catch (error) {
                console.log("something went wrong");
                toast({
                    title: "Something went wrong",
                    description: "Please try again later",
                    variant: "destructive"
                })
            }
        }

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="fullname"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Enter Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter full name" {...field} className="input-field" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Enter Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="Email address" {...field} className="input-field" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Enter Phone Number (Whatsapp)</FormLabel>
                                <FormControl>
                                    <Input type="phone" placeholder="Phone number(whatsapp)" {...field} className="input-field" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="question"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Enter Detail of Question</FormLabel>
                                <FormControl className="h-72">
                                    <Textarea placeholder="Provide questions" {...field} className="bg-grey-50 flex flex-1 placeholder:text-grey-500 p-16 px-5 py-3 border-none focus-visible:ring-transparent !important rounded-2xl" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Description(Optional)</FormLabel>
                                <FormControl className="h-72">
                                    <Textarea placeholder="Description" {...field} className="bg-grey-50 flex flex-1 placeholder:text-grey-500 p-16 px-5 py-3 border-none focus-visible:ring-transparent !important rounded-2xl" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Deadline Date</FormLabel>
                                <FormControl>
                                    <div className="h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date: Date) => field.onChange(date)}
                                            showTimeSelect
                                            timeInputLabel="Time:"
                                            dateFormat="MM/dd/yyyy h:mm aa"
                                            wrapperClassName="datePicker"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="problemType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Select Problem type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your category of help" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Research Assistance">Research Assistance</SelectItem>
                                        <SelectItem value="Nursing Care Study">Nursing Care Study</SelectItem>
                                        <SelectItem value="Thesis">Thesis</SelectItem>
                                        <SelectItem value="Homework Help">Homework Help</SelectItem>
                                        <SelectItem value="Essay Writing">Essay Writing</SelectItem>
                                        <SelectItem value="English Writing">English Writing</SelectItem>
                                        <SelectItem value="Typing Support">Typing Support</SelectItem>
                                        <SelectItem value="Presentation Work">Presentation Work</SelectItem>
                                        <SelectItem value="Essay Editing and Proofreading">Essay Editing and Proofreading</SelectItem>
                                        <SelectItem value="Subject Tutoring">Subject Tutoring</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>
                {type === "Create" ? (
                    <>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="sm"
                                    type="button"
                                    disabled={proceed}
                                >
                                    continue
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you ready to procceed?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        The cost for this project will be <span className="font-bold">{`${getPrice(priceToPay)}`}</span>, and if
                                        you agree to proceed, you may continue.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-red-600 hover:bg-red-700 text-white">Cancel</AlertDialogCancel>
                                    <Button
                                        onClick={form.handleSubmit(onSubmit)}
                                        size="sm"
                                        disabled={form.formState.isSubmitting}
                                        className=""
                                    >
                                        {form.formState.isSubmitting ? (
                                            'Submitting...'
                                        ) : 'Submit project'}</Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </>

                ) : (
                    <>
                        <Button
                            type="submit"
                            size="sm"
                            disabled={form.formState.isSubmitting}
                            className=""
                        >
                            {form.formState.isSubmitting ? (
                                'Submitting...'
                            ) : `Update project `}
                        </Button>
                    </>
                )
                }


            </form >
        </Form >
    )
}

export default ProjectForm
