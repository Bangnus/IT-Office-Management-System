import { useId } from "react";
import PropTypes from "prop-types";

/** Labelled text field. `OnChange` receives the new string value. */
const InputComponet = ({ label, value, OnChange, type, placeholder, hint, required, autoComplete, inputMode, className = "" }) => {
    const id = useId();
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label htmlFor={id} className="label">
                    {label}
                    {required && <span className="ml-0.5 text-red-600" aria-hidden="true">*</span>}
                </label>
            )}
            <input
                id={id}
                type={type ?? "text"}
                className="field"
                value={value ?? ""}
                placeholder={placeholder}
                required={required}
                autoComplete={autoComplete}
                inputMode={inputMode}
                onChange={(e) => OnChange(e.target.value)}
            />
            {hint && <p className="hint">{hint}</p>}
        </div>
    );
};

InputComponet.propTypes = {
    label: PropTypes.string,
    color: PropTypes.string, // kept for older callers; no longer used
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    OnChange: PropTypes.func,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    hint: PropTypes.node,
    required: PropTypes.bool,
    autoComplete: PropTypes.string,
    inputMode: PropTypes.string,
    className: PropTypes.string,
};

export default InputComponet;
