import PostThread from '@/components/general-discussion/forms/PostThread'
import { currentUser } from '@/lib/helpers/current-user'
import React from 'react'

const page = async () => {
    const user = await currentUser();
    return (
        <>
            <h1 className="text-2xl font-bold text-muted-foreground">Create Thread</h1>
            <PostThread userId={user._id} />
        </>
    )
}

export default page
