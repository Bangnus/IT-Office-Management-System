/* eslint-disable react-hooks/rules-of-hooks */
import InputComponet from '../../../components/content-input/input-full';
import ButtonFullComponent from '../../../components/content-buttons/full-button';
import PasswordField from './passwordField';
import { ToastifySuccess, ToastifyError } from '../../../components/content-alert/toastify';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/AuthProvider';
import Cookies from 'js-cookie';

// Same-origin path to open after signing in: the last dashboard page, or /dashboard.
// A full reload is needed because AxiosInstance reads the auth cookie when its module loads.
const goAfterSignIn = (lastPage) => {
    const safe = typeof lastPage === 'string' && lastPage.startsWith('/') && !lastPage.startsWith('//') && lastPage !== '/';
    window.location.href = safe ? lastPage : '/dashboard';
};

const failMessage = (response) =>
    response?.offline ? 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง' : 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';

const signinForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const autoTried = useRef(false);
    const auth = useAuth();
    const lastPage = Cookies.get('lastPath');

    const handleSignin = async (e) => {
        e?.preventDefault();
        if (isLoading) return;
        if (!username.trim() || !password) {
            ToastifyError({ label: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
            return;
        }
        setIsLoading(true);
        const response = await auth.SiginAction({ username: username.trim(), password });
        if (response?.status === true) {
            ToastifySuccess({ label: 'เข้าสู่ระบบสำเร็จ' });
            setTimeout(() => goAfterSignIn(lastPage), 800);
        } else {
            setIsLoading(false);
            ToastifyError({ label: failMessage(response) });
        }
    };

    // After sign-up the new credentials are left in localStorage so the user is signed in automatically
    useEffect(() => {
        const savedUser = localStorage.getItem('username');
        const savedPassword = localStorage.getItem('password');
        // Try once per visit: `auth` changes identity on every store update, which would otherwise retry in a loop
        if (!savedUser || !savedPassword || autoTried.current) return;
        autoTried.current = true;

        const autoSignIn = async () => {
            setIsLoading(true);
            const response = await auth.SiginAction({ username: savedUser, password: savedPassword });
            if (response?.status === true) {
                localStorage.removeItem('username');
                localStorage.removeItem('password');
                goAfterSignIn(lastPage);
            } else {
                setIsLoading(false);
            }
        };
        autoSignIn();
    }, [auth, lastPage]);

    return (
        <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink-900 md:text-xl">เข้าสู่ระบบ</h1>
            <p className="mt-1 text-sm text-ink-500">กรอกชื่อผู้ใช้และรหัสผ่านเพื่อเข้าใช้งานระบบ</p>

            <form onSubmit={handleSignin} className="mt-7 space-y-5" noValidate>
                <InputComponet label="ชื่อผู้ใช้" value={username} OnChange={setUsername} autoComplete="username" />
                <PasswordField value={password} OnChange={setPassword} autoComplete="current-password" />
                <ButtonFullComponent type="submit" color="blue" lable="เข้าสู่ระบบ" isLoading={isLoading} className="!mt-7" />
            </form>

            <p className="mt-6 text-center text-sm text-ink-500">
                ยังไม่มีบัญชี?{' '}
                <Link to="/authenticate/signup" className="font-medium text-brand-600 hover:text-brand-700 hover:underline">
                    สร้างบัญชีใหม่
                </Link>
            </p>
        </div>
    );
};

export default signinForm;
