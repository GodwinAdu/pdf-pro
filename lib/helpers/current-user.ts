"use server"
import { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { cookies } from "next/headers";
import { fetchUser } from "../actions/user.actions";
import jwt from 'jsonwebtoken';

interface decodeProps {
    id: string;
    username: string;
    fullName: string;
    phone: string;
    email: string;
    verified: boolean;
    lat: number;
    exp: number;
}

export async function currentUser() {
    try {
        const cookiesStore = cookies();
        const tokenValue = cookiesStore.get("credentials");

        if (!tokenValue || !tokenValue.value) {
            console.log("No token found in cookies");
            return null;
        }


        const decoded = jwt.verify(tokenValue.value, process.env.SECRET_KEY!) as string | JwtPayload;


        if (typeof decoded === 'object' && 'id' in decoded && 'username' in decoded) {
            const decode = decoded as decodeProps;

            const user = await fetchUser(decode.id);

            if (!user) {
                console.log("No user found with the given ID");
                return null;
            }

            // Return the user data
            return JSON.parse(JSON.stringify(user));
        }
        
        return null; // If it's not the expected type

    } catch (error) {
        if (error instanceof TokenExpiredError) {
            console.log("Token has expired");
            return;
        }

        console.error("Error decoding token", error);
        return null;
    }
}
