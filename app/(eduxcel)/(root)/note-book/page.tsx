import Notebook from '@/components/notebook/NoteBook'
import React from 'react'

const page = () => {
  return (
    <>
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">Student Notebook</h1>
      </div>
    </nav>
      <Notebook />
    </>
  )
}

export default page
