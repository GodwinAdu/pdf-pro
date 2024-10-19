"use server"

import { hash } from "bcryptjs";
import { wrappedSendMail } from "../helpers/node_mailer";
import User from "../models/user.models";
import { connectToDB } from "../mongoose"
import jwt from 'jsonwebtoken';
import { password_reset_2 } from "../email_template/password_reset_2";

const JWT_SECRET = process.env.SECRET_KEY!
export async function generateResetLink(email: string) {
    try {
        await connectToDB();

        const user = await User.findOne({ email })

        if (!user) throw new Error(`Could not find user ${email}`);

        // Generate the reset token
        const token = jwt.sign(
            { email: user.email, userId: user._id },
            JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );
        const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;
        const mailOptions = {
            from: "EduxcelMaster<jutechdevs@gmail.com>",
            to: user.email,
            subject: 'Password Reset Request',
            html: password_reset_2({ fullName: user.fullName, resetLink: resetUrl })
        }
        // Send reset password email
        await wrappedSendMail(mailOptions)

    } catch (error) {
        console.error("Error generating reset link:", error);
        throw error;
    }
}


export async function resetPassword(values: { password: string }, token:  any) {
    try {
        const { password } = values;
        await connectToDB();

        // Verify the token
        const data = await jwt.verify(token, JWT_SECRET);

        if (!data.email || !data.userId) throw new Error("Invalid token");

        const user = await User.findByIdAndUpdate(
            data.userId,
            { password: await hash(password, 10) },
            { new: true }
        );

        if (!user) throw new Error("User not found");

        return { success: true, message: "Password reset successfully" };

    } catch (error) {
        console.log("Unable to reset password", error);
        throw error;
    }
}