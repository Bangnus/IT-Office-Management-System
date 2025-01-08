import React from 'react'

const Hero = () => {
    return (
        <div className="h-screen bg-primary flex ">
            <div className="bg-primary text-white w-1/2 ">

            </div>
            <div className="flex items-center h-full bg-primary text-white w-1/2">
                <div className="">
                    <span className="text-[54px] font-bold block font-primaryBold leading-[60px]">AGENCY TOURISM</span>
                    <span className="text-[38px] font-bold block font-primaryBold leading-[60px]">IN THE SEA AND ACTIVITIES</span>
                    <span className="text-[38px] font-bold block font-primaryBold leading-[60px]">TO GROW YOUR BUSINESS</span>
                    <span className="text-base block">
                        <span className='text-[16px] block leading-[40px]'>Seamless software that enable agency </span>
                        <span className='text-[16px] blockleading-[40px]'>business or tourims company to accept</span>
                        <span className='text-[16px] block leading-[40px]'>tourism innovate at scale.</span>
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Hero