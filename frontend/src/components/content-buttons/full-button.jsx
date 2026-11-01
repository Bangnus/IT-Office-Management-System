import PropTypes from "prop-types";

const VARIANTS = { blue: "btn-primary", red: "btn-danger", gray: "btn-secondary", secondary: "btn-secondary" };

/** Full-width button. `color`: "blue" (primary, default), "red" (danger) or "gray" (secondary). */
const ButtonFullComponent = ({ lable, func, color, isLoading, className = "", type = "button", icon }) => {
    return (
        <button
            type={type}
            onClick={func}
            disabled={isLoading}
            aria-busy={isLoading || undefined}
            className={`${VARIANTS[color] ?? "btn-primary"} w-full ${className}`}
        >
            {isLoading ? (
                <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />
                    กำลังดำเนินการ…
                </>
            ) : (
                <>
                    {icon}
                    {lable}
                </>
            )}
        </button>
    );
};

ButtonFullComponent.propTypes = {
    lable: PropTypes.node,
    func: PropTypes.func,
    color: PropTypes.string,
    isLoading: PropTypes.bool,
    className: PropTypes.string,
    type: PropTypes.string,
    icon: PropTypes.node,
};

export default ButtonFullComponent;
