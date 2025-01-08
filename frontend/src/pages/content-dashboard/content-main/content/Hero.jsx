import { useEffect, useState } from 'react';
import HiGif from '../../../../assets/images/gif/hi.gif';
import InCome from '../../../../assets/images/svg/income.svg';
import { useSelector } from 'react-redux';
import SingleLaoding from '../../../../components/content-loading/single-loading';

const HereDashboard = () => {

    const currentAgent = useSelector((state) => state.auth.currentAgency);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (currentAgent !== null) setLoading(false);
    }, [currentAgent]);

    return(
        <div className="w-full px-3 bg-primaryofdashboard rounded-md animate-fade-up animate-once animate-duration-1000 animate-ease-in-out">
            <div className="flex justify-between">
                <div className="font-primaryMedium text-white text-nowrap py-5">
                    <div className='flex gap-x-2 items-end'>
                        <img src={HiGif} alt="" className='w-[40px]' />
                           {
                                loading ?
                                <SingleLaoding otherStyle="w-[20px]"/>
                                :
                                <span className="text-[20px]">HI, {currentAgent?.data.firstName} {currentAgent?.data.lastName}</span>
                            } 
                    </div>
                    <span className="block text-[20px]">Welcome back to</span>
                    <div className="mt-1">
                        <span className="text-[18px] bg-primary px-2 py-1 rounded-md">Booking Oasis Home</span>
                    </div>
                </div>
                <div className='flex items-end pr-8 pt-10'>
                    <img src={InCome} className='w-[150px]' alt="" />
                </div>
            </div>
        </div>
    );
};

export default HereDashboard;