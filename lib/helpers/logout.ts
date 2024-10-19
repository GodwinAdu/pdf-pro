"use server"
import { cookies } from "next/headers";
export async function logout() {
    try {
        const cookiesStore = cookies();
        const isDeleted = cookiesStore.delete("credentials");

        if (!isDeleted) {
            console.warn("Token cookie was not found or could not be deleted.");
            return false; // Return false or handle the case when the cookie is not found
        }

        // Additional cleanup or redirect logic if needed
        return true; // Return true indicating a successful logout
        
    } catch (error) {
        console.error("Failed to log out", error);
        throw error; // Rethrow the error or handle it appropriately
    }
}
