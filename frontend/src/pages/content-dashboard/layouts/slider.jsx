import { NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { LuPackage } from "react-icons/lu";
import { RiArrowLeftDoubleLine } from "react-icons/ri";
import { RiArrowRightDoubleLine } from "react-icons/ri";
import { PiShoppingBagOpenBold } from "react-icons/pi";
import LogoComponent from '../../../components/Logo/logo';
import Cookies from 'js-cookie';
import { useState } from "react";

const SliderComponent = () => {

    const [sliderSize, setSliderSize] = useState(Cookies.get('sliderSize'));

    const handlerChangeSize = async () => {
        await setSliderSize(!sliderSize);
        await Cookies.set('sliderSize', !sliderSize);
    }

    const MenuOption = [
        {
            label: 'Overview',
            path: '/dashboard',
            icon: <RxDashboard />,
        },
        {
            label: 'Orders',
            path: '/home/orders-view',
            icon: <LuPackage />,
        },
        {
            label: 'Packages Management',
            path: '/home/pakage-menagement',
            icon: <PiShoppingBagOpenBold />,
        },
    ];

    return(
        <div className={`h-screen bg-white ${ sliderSize === 'true' || sliderSize === true ? 'w-[75px]' : 'w-[270px]' } lg:w-[75px] duration-100 ease-in-out`}>
            <div className={`font-primaryBold uppercase text-white flex items-center h-[55px] lg:justify-center px-3 ${ sliderSize === 'true' || sliderSize === true ? 'justify-center' : 'justify-between' }`}>
                <div className={`${ sliderSize === 'true' || sliderSize === true ? 'hidden animate-fade animate-once animate-delay-500 animate-ease-in-out' : 'animate-fad animate-fade-right animate-once animate-delay-100 animate-ease-in-out' } lg:hidden`}>
                    <LogoComponent mode={true} />
                </div>
                <button onClick={handlerChangeSize} className='text-[30px] h-[35px] w-[35px] flex justify-center text-primary items-center hover:bg-primary hover:text-white duration-100 ease-in-out rounded-md'>
                    { sliderSize === 'true' || sliderSize === true ? <RiArrowRightDoubleLine /> : <RiArrowLeftDoubleLine /> } 
                </button>
            </div>
            <div className="w-full grid grid-cols-1 gap-y-2 duration-100 ease-in-out">
                {
                    MenuOption.map((items, key) => (
                        <NavLink key={key} className={({isActive}) => (isActive ? 'w-full px-3 flex items-center border-l-[5px] border-primary py-2 bg-blue-400 text-white font-primaryRegular text-[16px] duration-100 ease-in-out' : 'w-full px-3 flex items-center border-white border-l-[5px] py-2 text-primaryofdashboard font-primaryRegular text-[16px] duration-100 ease-in-out' )} to={items.path}>
                            <div className={`flex items-center gap-x-3 lg:ml-1 ${ sliderSize === 'true' || sliderSize === true ? 'ml-1' : '' }`}>
                                <div className="flex h-[35px] w-[35px] items-center justify-center rounded-md bg-primaryofdashboard text-white text-[16px]">
                                    {items.icon}
                                </div>
                                <span className={`lg:hidden ${ sliderSize === 'true' || sliderSize === true ? 'hidden' : '' }`}>{items.label}</span>
                            </div>
                        </NavLink>
                    ))
                }
            </div>
        </div>
    );
};

export default SliderComponent;