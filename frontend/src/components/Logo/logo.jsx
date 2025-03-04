import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const LogoComponent = ({ fontSize, mode }) => {
    return (
        <Link to="/dashboard" className={`flex flex-col items-center ${mode !== undefined ? 'text-primary' : ''}`}>
            <span className={`text-${fontSize} text-[20px] leading-none`}>
                it 
            </span>
            <span className={`${mode !== undefined ? 'text-primary' : 'text-secondery'} text-${fontSize} text-[15px] leading-none`}>
                management System
            </span>
        </Link>
    );
};

LogoComponent.propTypes = {
    fontSize: PropTypes.string,
    mode: PropTypes.any,
};

export default LogoComponent;