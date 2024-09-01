// import Button  from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

const Header = () => {
  return (
    <div className='p-5 border-b shadow-sm sticky top-0 bg-white'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center'>
            <Image src={'/logo.svg'} alt='logo' width={100} height={100}></Image>
            <p className='text-3xl '>Form Builder</p>
            </div>
            {/* <Button>Get Started</Button> */}
        </div>
    </div>
  )
}

export default Header
  