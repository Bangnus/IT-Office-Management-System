import { Link } from 'react-router-dom';
import LogoComponent from '../Logo/logo';
import PropTypes from 'prop-types';

const Navbar = ({ lightNav }) => {
  return (
    <>
      <nav className={`${ lightNav ? 'bg-white' : 'bg-primary' } text-[14px] font-primaryMedium ${ lightNav ? 'text-primary' : 'text-white' } px-5 py-3 flex justify-between items-center`}>
        <div className="font-primaryBold uppercase">
          <LogoComponent />
        </div>
        <div className=" flex gap-x-5 items-center">
          <Link className="hover:text-textdanger">Documentation</Link>
          <Link className="hover:text-textdanger">Contact us</Link>
          <Link className='py-2 rounded-md    duration-150 ease-in-out hover:text-textdanger ' to="/authenticate/signin" >Sign In</Link>
          <Link className={`border rounded-md py-2 px-4 text-[15px] duration-150 ease-in-out ${ lightNav ? 'border-primary hover:bg-primary hover:text-white' : 'border-sec hover:bg-danger hover:border-danger' }`} style={{ WebkitTextStroke: '0.4px #98DED9' }} to="/authenticate/signup" >Create account</Link>
          
        </div>
      </nav>
    </>
  );
};

Navbar.propTypes = {
  lightNav: PropTypes.bool,
};

export default Navbar