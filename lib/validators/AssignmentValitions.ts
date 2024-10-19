import { z } from "zod";

export const AssignmentSchema = z.object({
    fullname: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    email: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    phone: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    question: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    problemType: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    description: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    deadline: z.date({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    })
  });