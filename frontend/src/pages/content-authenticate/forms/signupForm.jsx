/* eslint-disable react-hooks/rules-of-hooks */
import InputComponet from '../../../components/content-input/input-full';
import ButtonFullComponent from '../../../components/content-buttons/full-button';
import PasswordField from './passwordField';
import { ToastifyError, ToastifySuccess } from '../../../components/content-alert/toastify';
import { createUser } from '../../../slicers/authenticateSlicer';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const signupForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const authToken = Cookies.get('authToken');

    const handleSignup = async (e) => {
        e?.preventDefault();
        if (isLoading) return;
        if (!firstName.trim() || !lastName.trim() || !username.trim() || !password) {
            ToastifyError({ label: 'กรุณากรอกข้อมูลให้ครบทุกช่อง' });
            return;
        }
        setIsLoading(true);
        try {
            const data = { username: username.trim(), firstName: firstName.trim(), lastName: lastName.trim(), password };
            const response = await dispatch(createUser(data));

            if (response.payload?.status === true) {
                // The sign-in page picks these up and signs the new user in automatically
                localStorage.setItem('username', data.username);
                localStorage.setItem('password', password);
                ToastifySuccess({ label: 'สร้างบัญชีสำเร็จ' });
                setUsername('');
                setFirstName('');
                setLastName('');
                setPassword('');
                setIsLoading(false);
                navigate('/authenticate/signin');
            } else {
                setIsLoading(false);
                ToastifyError({ label: response.payload ? 'สร้างบัญชีไม่สำเร็จ ชื่อผู้ใช้นี้อาจถูกใช้แล้ว' : 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง' });
            }
        } catch {
            setIsLoading(false);
            ToastifyError({ label: 'สร้างบัญชีไม่สำเร็จ กรุณาลองใหม่อีกครั้ง' });
        }
    };

    useEffect(() => {
        if (authToken) {
            navigate('/dashboard');
        }
    }, [authToken, navigate]);

    return (
        <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink-900 md:text-xl">สร้างบัญชีใหม่</h1>
            <p className="mt-1 text-sm text-ink-500">กรอกข้อมูลด้านล่างเพื่อสร้างบัญชีผู้ใช้งาน</p>

            <form onSubmit={handleSignup} className="mt-7 space-y-5" noValidate>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-1 sm:gap-5">
                    <InputComponet label="ชื่อ" value={firstName} OnChange={setFirstName} autoComplete="given-name" />
                    <InputComponet label="นามสกุล" value={lastName} OnChange={setLastName} autoComplete="family-name" />
                </div>
                <InputComponet label="ชื่อผู้ใช้" value={username} OnChange={setUsername} autoComplete="username" />
                <PasswordField value={password} OnChange={setPassword} autoComplete="new-password" />
                <ButtonFullComponent type="submit" color="blue" lable="สร้างบัญชี" isLoading={isLoading} className="!mt-7" />
            </form>

            <p className="mt-6 text-center text-sm text-ink-500">
                มีบัญชีอยู่แล้ว?{' '}
                <Link to="/authenticate/signin" className="font-medium text-brand-600 hover:text-brand-700 hover:underline">
                    เข้าสู่ระบบ
                </Link>
            </p>
        </div>
    );
};

export default signupForm;
