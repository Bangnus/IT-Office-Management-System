import PropTypes from 'prop-types';
import { LuMenu } from "react-icons/lu";
import AvatarComponent from '../../../components/content-avatar/Avatar-full-redrius';
import LogoComponent from '../../../components/Logo/logo';

/** Top bar: menu button + logo (small screens only), user menu. */
const NavOfDash = ({ userData, avatarName, onOpenMenu }) => {
    return (
        <header className='sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-200 bg-white/90 px-6 backdrop-blur md:px-4'>
            <button
                type="button"
                onClick={onOpenMenu}
                className='icon-btn -ml-2 hidden lg:inline-flex'
                aria-label='เปิดเมนู'
            >
                <LuMenu className='h-[22px] w-[22px]' />
            </button>
            <div className='hidden lg:block'>
                <LogoComponent />
            </div>
            <div className='flex-1' />
            <AvatarComponent AvatarName={avatarName} Cusname={userData} />
        </header>
    );
};

NavOfDash.propTypes = {
    userData: PropTypes.any,
    avatarName: PropTypes.any,
    onOpenMenu: PropTypes.func,
};

export default NavOfDash;
