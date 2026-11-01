import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/AuthProvider';
import { LuChevronDown, LuLogOut } from "react-icons/lu";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

/** User button in the top bar, with a sign-out menu. */
const AvatarComponent = ({ AvatarName, Cusname }) => {
  const auth = useAuth();

  if (Cusname?.firstName === undefined) {
    return (
      <div className='flex items-center gap-2' aria-hidden="true">
        <div className='h-9 w-9 animate-pulse rounded-full bg-ink-100' />
        <div className='h-4 w-24 animate-pulse rounded bg-ink-100 sm:hidden' />
      </div>
    );
  }

  const fullName = [Cusname.firstName, Cusname.lastName].filter(Boolean).join(' ');

  return (
    <Menu placement="bottom-end" animate={{ mount: { y: 0, opacity: 1 }, unmount: { y: -6, opacity: 0 } }}>
      <MenuHandler>
        <button type="button" className='flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-ink-100' aria-label={`บัญชีผู้ใช้ ${fullName}`}>
          <span className='flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700'>
            {AvatarName}
          </span>
          <span className='max-w-[160px] truncate text-sm font-medium text-ink-800 sm:hidden'>{fullName}</span>
          <LuChevronDown className='h-4 w-4 text-ink-400' />
        </button>
      </MenuHandler>
      <MenuList className='min-w-[220px] rounded-xl border-ink-200 p-1.5 font-sans shadow-pop'>
        <div className='px-3 pb-2 pt-1.5 outline-none' tabIndex={-1}>
          <div className='truncate text-sm font-semibold text-ink-900'>{fullName}</div>
          {Cusname.username && <div className='truncate text-[13px] text-ink-500'>{Cusname.username}</div>}
        </div>
        <hr className='my-1 border-ink-100' />
        <MenuItem onClick={() => auth.SignoutAction()} className='flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink-700 hover:!bg-red-50 hover:!text-red-700 focus:!bg-red-50 focus:!text-red-700'>
          <LuLogOut className='h-4 w-4' />
          ออกจากระบบ
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

AvatarComponent.propTypes = {
  AvatarName: PropTypes.string,
  Cusname: PropTypes.any,
};

export default AvatarComponent;
