import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const LogoComponent = ({ fontSize, mode }) => {
    return (
        <Link to="/dashboard" className={`flex flex-col items-center ${mode !== undefined ? 'text-primary' : ''}`}>
            <span className={`text-${fontSize} text-[25px] leading-none`}>
                Booking
            </span>
            <span className={`${mode !== undefined ? 'text-primary' : 'text-secondery'} text-${fontSize} text-[20px] leading-none`}>
                Oasis Home
            </span>
        </Link>
    );
};

LogoComponent.propTypes = {
    fontSize: PropTypes.string,
    mode: PropTypes.any,
};

export default LogoComponent;