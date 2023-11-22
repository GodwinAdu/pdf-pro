"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";

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

import { toast } from "./ui/use-toast";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { PaymentSchema } from "@/lib/validators/paymentValidation";
import { useEffect } from "react";
import { sendPayment } from "@/lib/actions/payment.actions";

const UpgradeButton = () => {
  // 1. Define your form.
  const form = useForm<z.infer<typeof PaymentSchema>>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      name: "",
      amount: 0,
      transaction: "",
      plan: "",
      period: "",
    },
  });
  const { watch } = form;
  const plan = watch("plan");
  const period = watch("period");

  useEffect(() => {
    // Update amount based on plan and period
    const updateAmount = () => {
      // Define your pricing logic here
      let newAmount = 0;

      if (plan === "pro") {
        if (period === "monthly") {
          newAmount = 50;
        } else if (period === "half a year") {
          newAmount = 50 * 6;
        } else if (period === "yearly") {
          newAmount = 50 * 12;
        }
      }

      // Set the new amount value in the form
      form.setValue("amount", newAmount);
    };

    // Call the updateAmount function when plan or period changes
    updateAmount();
  }, [plan, period, form]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PaymentSchema>) {
    try {
      console.log("Amount:", values.amount);
      console.log(values);
      await sendPayment({
        name: values.name,
        amount: values.amount,
        transaction: values.transaction,
        plan: values.plan,
        period: values.period,
      });
      toast({
        title: "Successfully sent",
        description: "Your project/assignment will solve before deadline",
      });

      form.reset();
    } catch (error: any) {
      console.log("error occured ", error);
      toast({
        title: "There was an error",
        description: "Couldn't send assignment. Try again later",
        variant: "destructive",
      });
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          Upgrade now <ArrowRight className="h-5 w-5 ml-1.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[96%] max-w-3xl h-[450px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Please Submit Assignment</DialogTitle>
          <DialogDescription className="flex gap-3">
            <p> Fill all the form to submit your problem/assignment.</p>{" "}
            <ArrowDown />
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
                      <FormLabel>Name of Sender</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Write sender's fullname here"
                          {...field}
                        />
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
                      <FormLabel>Amount payed</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="write amount payed here"
                          type="number"
                          {...field}
                          disabled
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transaction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trans. ID</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Please input the transaction ID here"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="plan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choose your plan</FormLabel>
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
                          <SelectItem value="pro">Pro</SelectItem>
                          <SelectItem value="forever">Forever</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="period"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choose choose</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="half a year">
                            Half a year
                          </SelectItem>
                          <SelectItem value="yearly">Yealy</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeButton;
