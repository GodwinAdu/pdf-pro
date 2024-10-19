"use client"
import { PaystackButton } from "react-paystack";
import { AlertDialogCancel } from "./ui/alert-dialog";
import { useState } from "react";
import { useRouter } from "next-nprogress-bar";
import { updateAssignmentPayment } from "@/lib/actions/assignment.actions";

interface PaymentButtonProps {
  projectId: string;
  name: string;
  email: string;
  amount: number;
  fileUrl: string
}
const PaymentButton = ({ projectId, name, email, amount, fileUrl }: PaymentButtonProps) => {
  const router = useRouter();


  const handleDownloadPdf = async () => {
    try {
      const response = await fetch(fileUrl, { cache: 'no-store' });
      const blob = await response.blob();
      // Generate a unique filename using timestamp
      const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Remove special characters from ISO timestamp
      const filename = `filename_${timestamp}.pdf`;

      const a = document.createElement('a');
      const blobUrl = URL.createObjectURL(blob);

      a.href = blobUrl;
      a.download = filename;

      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(fileUrl);

      console.log("Downloaded PDF");
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  }

  const subscriptionSuccess = async () => {
    try {
      router.push('/projects/thank_you')
      const updatedAssignment = await updateAssignmentPayment(projectId)
      if (updatedAssignment.status === "COMPLETED" && updatedAssignment.fileUrl !== null) {

        handleDownloadPdf();
      }
    } catch (error) {
      console.error("Error in success payment:", error);
    }

  };

  const subscriptionClose = () => {
    alert(`oops you've close it`);
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
    <>
      <form onSubmit={handleSubmit}>
        <AlertDialogCancel className="w-full">
          <PaystackButton {...componentProps} className="inline-block w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300" />
        </AlertDialogCancel>
      </form>
    </>
  )
}

export default PaymentButton
