import { NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { LuPackage } from "react-icons/lu";
import { RiArrowLeftDoubleLine, RiArrowRightDoubleLine } from "react-icons/ri";
import { PiShoppingBagOpenBold } from "react-icons/pi";
import LogoComponent from '../../../components/Logo/logo';
import Cookies from 'js-cookie';
import { useEffect, useState } from "react";
import { fetchclassVC } from "../../../slicers/classSlicer";
import { useSelector, useDispatch } from "react-redux";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";

const SliderComponent = () => {
    const dispatch = useDispatch();
    const [sliderSize, setSliderSize] = useState(Cookies.get('sliderSize') === 'true');
    const [isOpenMenu, setIsOpenMenu] = useState(null); // สำหรับการเปิด/ปิดเมนูย่อย
    const fetchClass = useSelector(state => Array.isArray(state.class.class) ? state.class.class : []);

    useEffect(() => {
        dispatch(fetchclassVC());
    }, [dispatch]);

    const handlerChangeSize = () => {
        setSliderSize(!sliderSize);
        Cookies.set('sliderSize', !sliderSize);
    };

    const handleToggleDropdown = (index, path) => {
        Cookies.set('MenuPath', path)
        setIsOpenMenu(isOpenMenu === index ? null : index);
    };

    // const handleMenuClick = (path) => {
    //     Cookies.set('MunuPath', path)
    // }
    const MenuOption = [
        {
            label: 'หน้าหลัก',
            path: '/dashboard',
            icon: <RxDashboard />,
        },
        {
            label: 'ข้อมูลอาจารย์',
            path: '/home/teacher',
            icon: <LuPackage />,
        },
        {
            label: 'ข้อมูลนักเรียน ปวช',
            path: '/home/Vocational-Certificate',
            icon: <PiShoppingBagOpenBold />,
            // subMenu: fetchClass?.filter(item => item.classroom.includes("ปวช"))?.map(item => ({
            //     label: item.classroom,
            //     path: `/class/${item.id}`,
            // })) || [],
        },
        {
            label: 'ข้อมูลนักเรียน ปวส',
            path: '/home/Higher-Vocational-Certificate',
            icon: <PiShoppingBagOpenBold />,
            // subMenu: fetchClass?.filter(item => item.classroom.includes("ปวส"))?.map(item => ({
            //     label: item.classroom,
            //     path: `/class/${item.id}`,
            // })) || [],
        },
        {
            label: 'ข้อมูลนักเรียน ป.ตรี',
            path: '/home/Bachelors-Degree',
            icon: <PiShoppingBagOpenBold />,
            // subMenu: fetchClass?.filter(item => item.classroom.includes("ป.ตรี"))?.map(item => ({
            //     label: item.classroom,
            //     path: `/class/${item.id}`,
            // })) || [],
        },
        {
            label: 'จัดการห้องเรียน',
            path: '/home/manage-classroom',
            icon: <PiShoppingBagOpenBold />,
        },
    ];

    return (
        <div className={`h-screen bg-white ${sliderSize ? 'w-[75px]' : 'w-[270px]'} lg:w-[75px] duration-100 ease-in-out`}>
            <div className={`font-primaryBold uppercase text-white flex items-center h-[55px] lg:justify-center px-3 ${sliderSize ? 'justify-center' : 'justify-between'}`}>
                <div className={`${sliderSize ? 'hidden' : 'animate-fade-right animate-once animate-delay-100 animate-ease-in-out'} lg:hidden`}>
                    <LogoComponent mode={true} />
                </div>
                <button
                    onClick={handlerChangeSize}
                    className="text-[30px] h-[35px] w-[35px] flex justify-center text-primary items-center hover:bg-primary hover:text-white duration-100 ease-in-out rounded-md"
                >
                    {sliderSize ? <RiArrowRightDoubleLine /> : <RiArrowLeftDoubleLine />}
                </button>
            </div>
            <div className="w-full grid grid-cols-1 gap-y-2 duration-100 ease-in-out">
                {MenuOption.map((item, index) => (
                    <div key={index}>
                        <NavLink
                            className={({ isActive }) =>
                                isActive ? 'w-full px-3 flex items-center border-l-[5px] border-primary py-2 bg-blue-400 text-white font-primaryRegular text-[16px]'
                                    : 'w-full px-3 flex items-center border-white border-l-[5px] py-2 text-primaryofdashboard font-primaryRegular text-[16px]'
                            }
                            to={item.path}
                            onClick={() => handleToggleDropdown(index, item.path)}
                        >
                            <div className={`flex items-center gap-x-3 lg:ml-1 ${sliderSize ? 'ml-1' : ''}`}>
                                <div className="flex h-[35px] w-[35px] items-center justify-center rounded-md bg-primaryofdashboard text-white text-[16px]">
                                    {item.icon}
                                </div>
                                <span className={`lg:hidden ${sliderSize ? 'hidden' : ''}`}>{item.label}</span>
                                {/* <div>
                                    {item.label !== 'หน้าหลัก' && (
                                        <div>
                                            {isOpenMenu === index ? <IoIosArrowDown /> : <IoIosArrowForward />}
                                        </div>
                                    )}
                                </div> */}
                            </div>
                        </NavLink>

                        {/* เมนูย่อย */}
                        {item.subMenu && item.subMenu.length > 0 && (
                            <div>
                                {isOpenMenu === index && (
                                    <div>
                                        {item.subMenu.map((subItem, subIndex) => (
                                            <NavLink
                                                key={subIndex}
                                                className={({ isActive }) =>
                                                    isActive ? 'w-full px-3 flex items-center border-l-[5px] border-primary py-2 bg-blue-400 text-white font-primaryRegular text-[16px]'
                                                        : 'hover:bg-blue-200 w-full flex items-center border-white py-2 text-primaryofdashboard font-primaryRegular text-[16px]'
                                                }
                                                to={subItem.path}
                                            >
                                                <span>{subItem.label}</span>
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SliderComponent;
