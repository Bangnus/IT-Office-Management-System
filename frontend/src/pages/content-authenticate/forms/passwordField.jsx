import { useId, useState } from 'react';
import PropTypes from 'prop-types';
import { LuEye, LuEyeOff } from 'react-icons/lu';

/** Password input with a show/hide toggle, styled like InputComponet. */
const PasswordField = ({ label = 'รหัสผ่าน', value, OnChange, autoComplete = 'current-password', hint }) => {
    const id = useId();
    const [visible, setVisible] = useState(false);
    const toggleLabel = visible ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน';

    return (
        <div className="w-full">
            <label htmlFor={id} className="label">{label}</label>
            <div className="relative">
                <input
                    id={id}
                    type={visible ? 'text' : 'password'}
                    className="field pr-11"
                    value={value ?? ''}
                    autoComplete={autoComplete}
                    onChange={(e) => OnChange(e.target.value)}
                />
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    className="icon-btn absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
                    aria-label={toggleLabel}
                    title={toggleLabel}
                    aria-pressed={visible}
                >
                    {visible ? <LuEyeOff className="h-[18px] w-[18px]" /> : <LuEye className="h-[18px] w-[18px]" />}
                </button>
            </div>
            {hint && <p className="hint">{hint}</p>}
        </div>
    );
};

PasswordField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    OnChange: PropTypes.func,
    autoComplete: PropTypes.string,
    hint: PropTypes.node,
};

export default PasswordField;
