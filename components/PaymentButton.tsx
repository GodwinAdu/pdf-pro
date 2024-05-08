"use client"
import { PaystackButton } from "react-paystack";
import { AlertDialogCancel } from "./ui/alert-dialog";

interface PaymentButtonProps {
  projectId: string;
  name: string;
  email: string;
  amount: number;
}
const PaymentButton = ({ projectId, name, email, amount }: PaymentButtonProps) => {

  const subscriptionSuccess = async () => {

  };

  const subscriptionClose = () => {
    alert('opps youve close it ')
  };


  const componentProps = {
    email,
    amount: amount * 100,
    custom_fields: {
      name,
    },
    currency: process.env.NEXT_PUBLIC_PAYSTACK_CURRENCY!,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
    text: "Pay Now",
    onSuccess: () => subscriptionSuccess(),
    onClose: () => subscriptionClose()
  }

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission here, e.g., send data to server
    console.log('Form submitted:');
  };


  return (
    <form onSubmit={handleSubmit}>
      <AlertDialogCancel>
        <PaystackButton {...componentProps} className="inline-block w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300" />
      </AlertDialogCancel>
    </form>
  )
}

export default PaymentButton
