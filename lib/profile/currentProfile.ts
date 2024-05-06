import { redirect } from "next/navigation";
import { fetchUser } from "../actions/user.actions";
import { auth } from "@clerk/nextjs/server";

export async function currentProfile() {

    const { userId } = auth();

    if (!userId) return redirect('/sign-in')

    const profile = await fetchUser({ clerkId: userId })

    if (!profile) return redirect('/auth-callback');

    return profile;
}