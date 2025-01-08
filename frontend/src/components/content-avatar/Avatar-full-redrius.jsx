import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/AuthProvider';
import SingleLaoding from '../content-loading/single-loading';
import RedirusFullLoading from '../content-loading/redirusfull-loading';
import { TbLogout2 } from "react-icons/tb";
import { MdOutlineAccountCircle } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa6";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";


const AvatarComponent = ({ AvatarName, Cusname }) => {

    const auth = useAuth();
    
    return(
      <div>
        {
          Cusname?.firstName === undefined || Cusname?.lastName === undefined ?
          <div className='flex items-center gap-x-2'>
            <RedirusFullLoading />
            <SingleLaoding otherStyle="w-[100px] h-[20px]" />
          </div>
          :
          <Menu
            animate={{
              mount: { y: 0 },
              unmount: { y: 25 },
            }}
          >
            <MenuHandler>
              <button className='flex border-none bg-primaryofdashboard items-center gap-x-2'>
                  <div className='w-[38px] h-[38px] rounded-full border-2 border-blue-500 bg-primary flex items-center justify-center'>
                      <span className='font-primaryMedium text-[14px] flex items-center justify-center text-secondery'>{AvatarName}</span>
                  </div>
                  <div className='font-primaryMedium text-white'>
                      <span>{`${Cusname?.firstName} ${Cusname?.lastName}`}</span>
                  </div>
                  <FaAngleDown className='text-white' />
              </button>
            </MenuHandler>
            <MenuList>
              <MenuItem>
                <div className='flex items-center gap-x-2'>
                  <MdOutlineAccountCircle />
                  <span>Account Settings</span>
                </div>
              </MenuItem>
              <MenuItem onClick={() => auth.SignoutAction()}>
                <div className='flex items-center gap-x-2'>
                  <TbLogout2 />
                  <span>Sign Out</span>
                </div>
              </MenuItem>
            </MenuList>
          </Menu>
        }
      </div>
    );
};

AvatarComponent.propTypes = {
    AvatarName: PropTypes.string,
    Cusname: PropTypes.any,
};

export default AvatarComponent;