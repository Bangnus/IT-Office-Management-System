import { Input } from "@material-tailwind/react";
import PropTypes from "prop-types";

const InputComponet = ({ label, color, value, OnChange, type }) => {
    return(
        <Input size="md" type={type == undefined ? 'text' : type} color={color} label={label} value={value} onChange={(e) => OnChange(e.target.value)} 
         />
    );
};

InputComponet.propTypes = {
    label: PropTypes.string,
    color: PropTypes.string,
    value: PropTypes.string,
    OnChange: PropTypes.func,
    type: PropTypes.string,
};

export default InputComponet;