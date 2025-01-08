import { Radio } from "@material-tailwind/react";
import PropTypes from "prop-types";



const RadioComponent = ({ label, color, value, OnChange, type }) => {
    return(
        <Radio size="md" type={type == undefined ? 'radio' : type} color={color} label={label} value={value} onChange={(e) => OnChange(e.target.value)} 
         />
    );
};

RadioComponent.propTypes = {
    label: PropTypes.string,
    color: PropTypes.string,
    value: PropTypes.string,
    OnChange: PropTypes.func,
    type: PropTypes.string,
};

export default RadioComponent;