import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import {
    LuLayoutDashboard,
    LuUsers,
    LuGraduationCap,
    LuDoorOpen,
    LuMonitor,
    LuChevronsLeft,
    LuChevronsRight,
    LuX,
} from "react-icons/lu";
import LogoComponent from "../../../components/Logo/logo";

export const MENU_GROUPS = [
    {
        items: [{ label: "หน้าหลัก", path: "/dashboard", icon: LuLayoutDashboard }],
    },
    {
        title: "บุคลากรและนักเรียน",
        items: [
            { label: "ข้อมูลอาจารย์", path: "/home/teacher", icon: LuUsers },
            { label: "นักเรียน ปวช.", path: "/home/Vocational-Certificate", icon: LuGraduationCap },
            { label: "นักเรียน ปวส.", path: "/home/Higher-Vocational-Certificate", icon: LuGraduationCap },
            { label: "นักเรียน ป.ตรี", path: "/home/Bachelors-Degree", icon: LuGraduationCap },
        ],
    },
    {
        title: "อาคารและอุปกรณ์",
        items: [
            { label: "จัดการห้องเรียน", path: "/home/manage-classroom", icon: LuDoorOpen },
            { label: "จัดการอุปกรณ์", path: "/home/manage-equipment", icon: LuMonitor },
        ],
    },
];

/** Sidebar navigation. Used as the fixed desktop sidebar and inside the mobile drawer. */
const SliderComponent = ({ collapsed = false, onToggle, onClose, inDrawer = false }) => {
    const narrow = collapsed && !inDrawer;

    return (
        <div className="flex h-full flex-col bg-white">
            <div className={`flex h-16 shrink-0 items-center border-b border-ink-200 px-4 ${narrow ? "justify-center" : "justify-between"}`}>
                <LogoComponent compact={narrow} />
                {inDrawer && (
                    <button type="button" onClick={onClose} className="icon-btn" aria-label="ปิดเมนู">
                        <LuX className="h-5 w-5" />
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="เมนูหลัก">
                {MENU_GROUPS.map((group, gi) => (
                    <div key={gi} className={gi > 0 ? "mt-5" : ""}>
                        {group.title && !narrow && (
                            <div className="mb-1.5 px-3 text-xs font-medium text-ink-400">{group.title}</div>
                        )}
                        {group.title && narrow && <div className="mx-3 mb-2 border-t border-ink-200" />}
                        <ul className="space-y-0.5">
                            {group.items.map(({ label, path, icon: Icon }) => (
                                <li key={path}>
                                    <NavLink
                                        to={path}
                                        onClick={onClose}
                                        title={narrow ? label : undefined}
                                        className={({ isActive }) =>
                                            `group flex min-h-[42px] items-center gap-3 rounded-lg px-3 text-[15px] transition-colors duration-150 ${narrow ? "justify-center" : ""} ${isActive
                                                ? "bg-brand-50 font-semibold text-brand-700"
                                                : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                                            }`
                                        }
                                    >
                                        {({ isActive }) => (
                                            <>
                                                <Icon className={`h-[19px] w-[19px] shrink-0 ${isActive ? "text-brand-600" : "text-ink-400 group-hover:text-ink-600"}`} />
                                                {!narrow && <span className="truncate">{label}</span>}
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            {!inDrawer && (
                <div className="shrink-0 border-t border-ink-200 p-3">
                    <button
                        type="button"
                        onClick={onToggle}
                        className={`flex min-h-[40px] w-full items-center gap-3 rounded-lg px-3 text-sm text-ink-500 transition-colors hover:bg-ink-100 hover:text-ink-900 ${narrow ? "justify-center" : ""}`}
                        aria-label={narrow ? "ขยายเมนู" : "ย่อเมนู"}
                        title={narrow ? "ขยายเมนู" : "ย่อเมนู"}
                    >
                        {narrow ? <LuChevronsRight className="h-[18px] w-[18px]" /> : <LuChevronsLeft className="h-[18px] w-[18px]" />}
                        {!narrow && <span>ย่อเมนู</span>}
                    </button>
                </div>
            )}
        </div>
    );
};

SliderComponent.propTypes = {
    collapsed: PropTypes.bool,
    onToggle: PropTypes.func,
    onClose: PropTypes.func,
    inDrawer: PropTypes.bool,
};

export default SliderComponent;
