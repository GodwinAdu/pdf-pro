import { z } from "zod";

export const PaymentSchema = z.object({
    name: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    amount:z.coerce.number({
        required_error: "Amount is required",
        invalid_type_error:" Amount must be a number",
      }),
    transaction: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    plan: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    period: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    
  });