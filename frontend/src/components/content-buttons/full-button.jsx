import { Button } from "@material-tailwind/react";
import PropTypes from "prop-types";
import DotLoading from "../content-loading/dot-loading";

const ButtonFullComponent = ({ lable, func, color, isLoading }) => {
    return(
        <Button className="w-full" onClick={func} color={color} disabled={isLoading}>{isLoading ? <DotLoading /> : lable}</Button>
    );
};

ButtonFullComponent.propTypes = {
    lable: PropTypes.string,
    func: PropTypes.func,
    color: PropTypes.string,
    isLoading: PropTypes.bool,
}

export default ButtonFullComponent;