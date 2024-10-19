import React from 'react'
import Navbar from './Navbar'
import { currentUser } from '@/lib/helpers/current-user'

const MainNavbar = async () => {
    const user = await currentUser()
    
    return (
        <>
            <Navbar user={user} />
        </>
    )
}

export default MainNavbar
