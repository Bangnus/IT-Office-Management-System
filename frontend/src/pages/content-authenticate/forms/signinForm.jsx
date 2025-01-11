/* eslint-disable react-hooks/rules-of-hooks */
// component
import LogoComponent from '../../../components/Logo/logo'
import InputComponet from '../../../components/content-input/input-full';
import OutlineButtonComponent from '../../../components/content-buttons/outline-button';
import GoogleIcon from '../../../assets/Icons/google-icon.png';
import FacebookIcon from '../../../assets/Icons/facebook-icon.png';
import ButtonFullComponent from '../../../components/content-buttons/full-button';
import { useState, useEffect, useRef } from 'react';
import { ToastifySuccess, ToastifyError } from '../../../components/content-alert/toastify';


// libs
import { Divider } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/AuthProvider';
import Cookies from 'js-cookie';

const signinForm = () => {

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isFatcing = useRef(false);
    const auth = useAuth();
    const authToken = Cookies.get('authToken');
    const lastPage = Cookies.get("lastPath");
    let localpath = window.location.href;

    const handleSignup = async () => {
        try {
            setIsLoading(true);
            if (!username ||!password) throw 'All fields are required';
            let data = {
                username: username,
                password: password
            };
            const response = await auth.SiginAction(data);

            if (response.status === true) {
                ToastifySuccess({ lable: 'Sign In successfully' });
                setIsLoading(false);
                setTimeout(() => {
                    if (lastPage === undefined || lastPage === '/') {
                        window.location.href = `http://127.0.0.1:5173/dashboard`;
                    } else {
                        window.location.href = `http://127.0.0.1:5173${lastPage}`;
                    }
                }, 2000);
            }
        } catch (error) {
            setIsLoading(false);
            ToastifyError({ label: error });
        }
    };

    useEffect(() => {
        const getdataField = async () => {
            const username = localStorage.getItem('username');
            const password = localStorage.getItem('password');
            autoSignIn(username, password);
        };

        const autoSignIn = async (username, password) => {
            try { 
                if (isFatcing.current) return;
                setIsLoading(true);
              
                let FormData = {
                    username: username,
                    password: password
                }
                isFatcing.current = true;
                const response = await auth.SiginAction(FormData);
                isFatcing.current = false;                
    
                if (response.status === true) {
                    await localStorage.removeItem('username');
                    await localStorage.removeItem('password');
                    setUsername('');
                    setPassword('');
                    setIsLoading(false);
                    if (lastPage === undefined || lastPage === '/') {
                        window.location.href = `http://127.0.0.1:5173/dashboard`;
                    } else {
                        window.location.href = `http://127.0.0.1:5173${lastPage}`;
                    }
                }
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                setIsLoading(false);
            }
        };

        if (localStorage.getItem('username') && localStorage.getItem('password')) {
            getdataField();
        }
    }, [auth, navigate, authToken, lastPage, localpath]);

    // useEffect(() => {
    //     if (authToken) {
    //         navigate(lastPage);
    //     }
 
    // }, [authToken, navigate, lastPage]);

    return (
        <div className="my-10 px-[20px] xs:mt-0">
            <div className="font-primaryBold text-primary uppercase animate-fade-down animate-once animate-duration-1000 animate-delay-100 text-[25px]">
                <LogoComponent />
            </div>
            <div className="font-primaryMedium text-[20px] animate-fade-down animate-once animate-duration-1000">
                <span>Sign In</span>
            </div>
            <div className="my-[20px] animate-fade-left animate-once animate-duration-1000">
                <div className="my-5">
                    <InputComponet color="blue" label="Username" value={username} OnChange={setUsername} />
                </div>
                <div className="mt-5 mb-2">
                    <InputComponet color="blue" type="password" label="Password" value={password} OnChange={setPassword} />
                </div>
                <div className="flex justify-between text-[14px] text-primary xs:text-[12px] xs:mt-5">
                    <Link to="/authenticate/signup">Create new account</Link>
                    <Link className="text-danger">Forgot Password?</Link>
                </div>
            </div>
            <div className="animate-fade-up animate-once animate-duration-1000">
                <ButtonFullComponent color="blue" lable="Sign In" func={handleSignup} isLoading={isLoading} />
            </div>
        </div>
    )
}

export default signinForm