import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { LuMonitor } from "react-icons/lu";

/** Logo mark + wordmark. `compact` shows the mark only. */
const LogoComponent = ({ compact = false, to = "/dashboard" }) => {
    return (
        <Link to={to} className="flex items-center gap-2.5 rounded-lg" aria-label="IT Office Management System">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand-600 text-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)]">
                <LuMonitor className="h-[19px] w-[19px]" strokeWidth={2.2} />
            </span>
            {!compact && (
                <span className="flex flex-col leading-tight">
                    <span className="text-[15px] font-bold tracking-tight text-ink-900">IT Office</span>
                    <span className="text-[11px] font-medium text-ink-500">Management System</span>
                </span>
            )}
        </Link>
    );
};

LogoComponent.propTypes = {
    compact: PropTypes.bool,
    to: PropTypes.string,
};

export default LogoComponent;
