import React from 'react'
import AuthenticateForm from '../_component/AuthenticateForm'
import { currentUser } from '@/lib/helpers/current-user'

const page = async () => {
    const user = await currentUser()
  return (
    <>
      <AuthenticateForm user={user} />
    </>
  )
}

export default page
