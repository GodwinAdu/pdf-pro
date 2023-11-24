import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser } from "../actions/user.actions";


export async function currentProfile(){
    const user = await currentUser();
    
    if(!user) return redirect('/sign-in')

    const profile = fetchUser({id:user?.id})
    
    if(!profile) return redirect('/auth-callback');

    return profile;
}