"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { PaystackButton } from "react-paystack";
import { IUser } from "@/lib/models/user.models";
import { updateUserSubscription } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";


interface UpgradeProps {
  plan: string;
  profile: IUser
}
const UpgradeButton = ({ plan, profile }: UpgradeProps) => {
  const [formData, setFormData] = useState({
    name: profile?.fullName,
    email: profile?.email,
    phone: '',
    amount: 0,
    plan: 'pro',
    period: ''
  });

  const router = useRouter()

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };


  const handlePeriodChange = (e: any) => {
    const { value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      period: value
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission here, e.g., send data to server
    console.log('Form submitted:', formData);
    // Reset form fields
    setFormData({
      name: profile?.fullName,
      email: profile?.email,
      phone: '',
      amount: 0,
      plan: 'pro',
      period: ''
    });
  };

  useEffect(() => {
    // Update amount based on plan and period
    const updateAmount = () => {
      let newAmount = 0;
      if (formData.plan === "pro") {
        if (formData.period === "monthly") {
          newAmount = 150;
        } else if (formData.period === "6-months") {
          newAmount = 850;
        } else if (formData.period === "yearly") {
          newAmount = 1650;
        }
      }
      setFormData(prevData => ({
        ...prevData,
        amount: newAmount
      }));
    };
    // Call the updateAmount function when plan or period changes
    updateAmount();
  }, [formData.plan, formData.period]);

  const subscriptionSuccess = async () => {
    await updateUserSubscription({
      id: profile?._id,
      plan: formData.plan,
      amount: formData.amount,
      period: formData.period as "monthly" | "6-months" | "yearly"

    })
  };

  const subscriptionClose = () => {
    alert('opps youve close it ')
  };

  const componentProps = {
    email: formData.email,
    amount: formData.amount * 100,
    custom_fields: {
      name: formData.name,
      phone: formData.phone
    },
    currency: process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY!,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    text: "Upgrade Now",
    onSuccess: () => subscriptionSuccess(),
    onClose: () => subscriptionClose()
  }



  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={plan === "Forever"} className="w-full">
          Upgrade now <ArrowRight className="h-5 w-5 ml-1.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[96%] max-w-lg">
        <DialogHeader>
          <DialogTitle>Please Submit Assignment</DialogTitle>
        </DialogHeader>
        <div className="w-full mx-auto p-6 bg-white shadow-md rounded-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-3">
              <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                disabled
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter your amount number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div className="flex flex-col gap-3 mb-5">
              <label htmlFor="subscription">Choose Period:</label>
              <select
                id="subscription"
                value={formData.period}
                onChange={handlePeriodChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a Period</option>
                <option value="monthly">monthly</option>
                <option value="6-months">6 months</option>
                <option value="yearly">yearly</option>
              </select>
            </div>
            <DialogClose>
              <PaystackButton {...componentProps} className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300" />
            </DialogClose>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradeButton;
