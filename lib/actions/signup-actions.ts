"use server"


import { cookies, headers } from "next/headers";
import Coin from "../models/coin.models";
import User from "../models/user.models";
import { connectToDB } from "../mongoose";
import { compare, hash } from "bcryptjs"
import jwt from "jsonwebtoken"
import CoinTransaction from "../models/coin-transaction.models";
import { generateReferral } from "../utils";
import FailedLoginAttempt from "../models/fail-login.models";



const tokenSecret = process.env.SECRET_KEY!;
const MAX_LOGIN_ATTEMPTS = 5; // Maximum allowed login attempts
const LOCK_TIME = 30 * 60 * 1000; // Lock duration in milliseconds (e.g., 30 minutes)


interface Props {
    username: string;
    imageUrl?: string | undefined;
    fullName: string;
    email: string;
    phone: string;
    password: string;
}

export async function createUser(values: Props, referral: string | null | undefined, origin?: string | null | undefined) {
    try {
        const { imageUrl, username, fullName, email, phone, password } = values;

        await connectToDB();

        // Check if username or email already exists in one query
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            throw new Error(existingUser.username === username
                ? "User with username already exists"
                : "User with email already exists");
        }

        const hashedPassword = await hash(password, 10);

        // Create new user
        const newUser = new User({
            imageUrl: imageUrl ?? '',
            username,
            fullName,
            referralCode: generateReferral(),
            email,
            phone,
            password: hashedPassword,
        });

        // Create coin object and coin transaction object
        const newCoin = new Coin({
            userId: newUser._id,
            coin: 300, // Initial coin amount
        });

        const coinTransaction = new CoinTransaction({
            userId: newUser._id,
            action: "BONUS",
            amount: 300,
            details: "Starter amount",
        });

        newUser.coinId = newCoin._id;

        // Handle referral logic
        if (referral) {
            const referrer = await User.findOne({ referralCode: referral });

            const referrerCoin = new CoinTransaction({
                userId: referrer._id,
                action: "BONUS",
                amount: 50,
                details: `Referral Bonus from ${fullName}`,
            });

            referrer.teamMembers.push(newUser._id);

            await Promise.all([
                await Coin.findOneAndUpdate(
                    { userId: referrer._id },
                    { $inc: { coin: 50 } },
                    { new: true }
                ),

                referrerCoin.save(),

                referrer.save(),

            ])


        }

        // Save user, coin, and transaction together
        await Promise.all([
            newUser.save(),
            newCoin.save(),
            coinTransaction.save()
        ]);

        // Handle token and cookie if origin exists
        if (origin) {
            const tokenPayload = {
                id: newUser._id,
                username: newUser.username,
                fullName: newUser.fullName,
                email: newUser.email,
                phone: newUser.phone,
                verified: newUser.verified
            };

            const token = await jwt.sign(tokenPayload, tokenSecret, { expiresIn: "1d" });
            const oneDay = 24 * 60 * 60 * 1000;

            cookies().set({
                name: "credentials",
                value: token,
                expires: new Date(Date.now() + oneDay),
                httpOnly: true,
                path: '/',
            });
        }


    } catch (error) {
        console.error("Error creating user", error);
        throw error;
    }
}


interface LoginProps {
    email: string;
    password: string;
}

const handleFailedAttempt = async (failedLogin: any, ipAddress: string) => {
    if (failedLogin) {
        failedLogin.attempts += 1;

        // Lock the IP if attempts exceed the maximum limit
        if (failedLogin.attempts >= MAX_LOGIN_ATTEMPTS) {
            failedLogin.lockedUntil = new Date(Date.now() + LOCK_TIME);
        }

        await failedLogin.save();
    } else {
        // Create a new failed login record for the IP
        await FailedLoginAttempt.create({
            ipAddress,
            attempts: 1,
        });
    }
};

export async function logInUser(values: LoginProps) {
    try {
        const { email, password } = values;
        const ipAddress = headers().get('x-forwarded-for') || ''; // Get x-forwarded-for header
        // Connect to your database
        await connectToDB();

        const failedLogin = await FailedLoginAttempt.findOne({ ipAddress });

        // Check if the IP address is locked
        if (failedLogin && failedLogin.lockedUntil && new Date() < failedLogin.lockedUntil) {
            throw new Error('Too many login attempts detected')
        }

        const user = await User.findOne({ email });

        if (!user) {
            // Increment failed login attempts for the IP address
            await handleFailedAttempt(failedLogin, ipAddress);
            throw new Error('Invalid email or password');
        }

        // Check if password is correct
        const isMatch = await compare(password, user.password);

        if (!isMatch) {
            // Increment failed attempts for the IP address
            await handleFailedAttempt(failedLogin, ipAddress);
            throw new Error('Invalid email or password');
        }

        // Successful login, reset failed login attempts
        if (failedLogin) {
            failedLogin.attempts = 0;
            await failedLogin.save()  
        }
        user.lastLogin = new Date(Date.now());
        await user.save();
        
        // Create a payload for the JWT token
        const value = {
            id: user._id,
            username: user.username,
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
        };

        // Sign the JWT token
        const token = await jwt.sign(value, tokenSecret, { expiresIn: "1d" });
        const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds

        // Set the cookie with the JWT token
        cookies().set({
            name: "credentials",
            value: token,
            expires: new Date(Date.now() + oneDay), // Expiration set to 1 day from now
            httpOnly: true, // Make the cookie accessible only on the server-side
            path: '/', // Cookie is valid for the entire site
        });

        return true;

    } catch (error) {
        console.log("Error logging in user", error);
        throw error;
    }
}
