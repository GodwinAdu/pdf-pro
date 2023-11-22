"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { ArrowDown, CalendarIcon } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { AssignmentSchema } from "@/lib/validators/AssignmentValitions";
import { toast } from "../ui/use-toast";
import { postAssignment } from "@/lib/actions/assignment.actions";
import Link from "next/link";



export function GetHelpButton() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof AssignmentSchema>>({
    resolver: zodResolver(AssignmentSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      problem: "",
      question:"",
      description:"",
      deadline: new Date(),
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof AssignmentSchema>) {
     try {
        await postAssignment({
            name:values.name,
            email:values.email,
            phone:values.phone,
            problem:values.problem,
            question:values.question,
            description:values.description,
            deadline:values.deadline
        })
        toast({
            title: "Successfully sent",
            description: "Your project/assignment will solve before deadline",
          })

        form.reset()
        
     } catch (error:any) {
        console.log('error occured ',error)
        toast({
            title: "There was an error",
            description: "Couldn't send assignment. Try again later",
            variant:"destructive"
          })
     }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Get help now</Button>
      </DialogTrigger>
      <DialogContent className="w-[96%] max-w-3xl h-[450px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Please Submit Assignment</DialogTitle>
          <DialogDescription className="flex gap-3">
           <p> Fill all the form to submit your problem/assignment.</p> <ArrowDown />
          </DialogDescription>
        </DialogHeader>
        <div className="">
          <div className="">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Write your fullname here" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="write email here" {...field} />
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
                      <FormLabel>Phone (Whatsapp)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your whatsapp number here" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="problem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choose your problem</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your problem/assignment" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="any">
                            Any
                          </SelectItem>
                          <SelectItem value="english writing">
                            English Writing
                          </SelectItem>
                          <SelectItem value="typing support">
                            Typing Support
                          </SelectItem>
                          <SelectItem value="research work">
                            Research work Assistance
                          </SelectItem>
                          <SelectItem value="nursing care study">
                            Nursing care study
                          </SelectItem>
                          <SelectItem value="online exams">
                            Online Exams Assistance
                          </SelectItem>
                          <SelectItem value="design project">
                            Design Projects
                          </SelectItem>
                          <SelectItem value="website">
                            Any kind of Website
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provide Questions</FormLabel>
                      <FormControl>
                        <Textarea
                          maxRows={4}
                          placeholder="Input questions for assistance"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          maxRows={4}
                          placeholder="Describe how you want the Assignment"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
            <div className="pt-4">
              <p className='font-italic text-sm'>You can contact/whatsapp me <span className='text-red-500'><Link href='https://wa.me/+233551556650'>+233551556650</Link></span></p>
              <p className='text-xs pt-2'><span className='font-bold'>NOTE:</span> please you will be charge for any assignment/project that you need solution for.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
