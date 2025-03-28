import Image from 'next/image'
import React from 'react'

const Agent = () => {
    const isSpeaking = true
  return (
    <div className='flex sm:flex-row flex-col gap-10 items-center justify-between w-full'>
        <div className='flex-center flex-col gap-2 p-7 h-[400px] blue-gradient-dark rounded-lg border-2 border-primary-200/50 flex-1 sm:basis-1/2 w-full'>
        <div className='z-10 flex items-center justify-center blue-gradient rounded-full size-[120px] relative'>
                <Image src="/ai-avatar.png" alt="vapi" width={65} height={54}  className='object-cover'/>
                {isSpeaking && <span className='absolute inline-flex size-5/6 animate-ping rounded-full bg-primary-200 opacity-75' />}
            </div>
        </div>
      
    </div>
  )
}

export default Agent
