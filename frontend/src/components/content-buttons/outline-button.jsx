import { Button } from "@material-tailwind/react";
import PropTypes from "prop-types";

const OutlineButtonComponent = ({ children, func, color, otherStyle }) => {
    return(
        <Button variant="outlined" className={otherStyle} onClick={func} color={color}>{children}</Button>
    );
};

OutlineButtonComponent.propTypes = {
    children: PropTypes.any,
    func: PropTypes.func,
    color: PropTypes.string,
    otherStyle: PropTypes.string,
}

export default OutlineButtonComponent;