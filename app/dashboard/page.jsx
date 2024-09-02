import { Button } from '@/components/ui/button'
import React from 'react'
import CreateForm from './_components/CreateForm'

const page = () => {
  return (
    <div className='p-10 flex items-center justify-between'>
      <h2 className="text-3xl font-bold ">Dashboard
      </h2>
        <CreateForm />
    </div>
  )
}

export default page

