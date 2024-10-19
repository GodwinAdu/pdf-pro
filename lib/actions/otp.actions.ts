"use server"

import { template_2 } from "../email_template/template_2";
import { currentUser } from "../helpers/current-user";
import { wrappedSendMail } from "../helpers/node_mailer";
import Otp from "../models/otp. models";
import User from "../models/user.models";
import { connectToDB } from "../mongoose";
import { generateOtp } from "../utils";
import { cookies } from 'next/headers'; // To handle cookies
import jwt from 'jsonwebtoken';

const tokenSecret = process.env.SECRET_KEY!;

// Function to create and save OTP
export const resendOtp = async () => {
    try {
        const user = await currentUser();
        const userId = user._id;
        await connectToDB()
        // Check if an OTP already exists for the user
        const existingOtp = await Otp.findOne({ userId });

        // If an OTP exists, delete it before creating a new one
        if (existingOtp) {
            await Otp.deleteOne({ userId });
        }

        // Generate a new OTP
        const otp = generateOtp();

        const mailOptions = {
            from: "EduxcelMaster<jutechdevs@gmail.com>",
            to: user.email,
            subject: 'Verification Code',
            html: template_2({ fullName: user.fullName, otp })
        }




        // Set expiration time (e.g., 10 minutes from now)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Current time + 10 minutes

        // Create a new OTP entry
        const newOtp = new Otp({
            userId,
            code: otp,
            expiresAt,
        });

        await Promise.all([
            newOtp.save(),
            wrappedSendMail(mailOptions),
        ]);

        // Return the OTP (this is just for testing; in production, send it via email or SMS)
        return { success: true, otp, message: "OTP generated and saved successfully." };
    } catch (error) {
        console.error("Error creating OTP:", error);
        return { success: false, message: "An error occurred while generating the OTP." };
    }
};


export const verifyOtp = async (otp: string) => {
    try {
        const user = await currentUser()
        const userId = user._id;
        // Find the OTP entry for the given userId
        const otpEntry = await Otp.findOne({ userId });

        // Check if OTP exists
        if (!otpEntry) {
            throw new Error(`OTP entry not found`);
        }

        // Check if the OTP has expired
        if (otpEntry.expiresAt < new Date()) {
            // Optionally, remove the expired OTP from the database
            await Otp.deleteOne({ _id: otpEntry._id });
            return { success: false, message: "OTP has expired" };
        }

        // Compare the provided OTP with the stored OTP
        if (otpEntry.code === otp) {
            // OTP is valid, remove it from the database after successful verification
            await Otp.deleteOne({ _id: otpEntry._id });
            // Update user's verified status to true
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { emailVerified: true },
                { new: true } // Return the updated user
            );

            const value = {
                id: updatedUser._id,
                username: updatedUser.username,
                fullName: updatedUser.fullName,
                email: updatedUser.email,
                phone: updatedUser.phone,
                emailVerified: updatedUser.emailVerified,
                phoneVerified: updatedUser.phoneVerified,
            }

            const token = await jwt.sign(value, tokenSecret, { expiresIn: "1d" })


            const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds
            await cookies().set("credentials", token, {
                expires: new Date(Date.now() + oneDay), // Expiration set to 1 day from now
                httpOnly: true, // Cookie will be accessible only on the server-side
                path: '/', // Set the cookie's path, typically '/'
            });


            return { success: true, message: "OTP verified successfully" };
        } else {
            return { success: false, message: "Invalid OTP" };
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return { success: false, message: "An error occurred during verification" };
    }
};