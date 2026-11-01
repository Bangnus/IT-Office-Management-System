import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Callers pass either `lable` (original spelling) or `label`; accept both so the message is never "undefined"
const options = { position: "top-right", autoClose: 3500, closeOnClick: true, pauseOnHover: true, theme: "light" };
const text = ({ lable, label } = {}) => {
    const value = label ?? lable;
    if (value instanceof Error) return value.message;
    return typeof value === 'string' && value ? value : 'เกิดข้อผิดพลาด กรุณาลองใหม่';
};

export const ToastifySuccess = (args) => toast.success(text(args), options);
export const ToastifyError = (args) => toast.error(text(args), options);
export const ToastifyWarning = (args) => toast.warn(text(args), options);
export const ToastifyInfo = (args) => toast.info(text(args), options);
