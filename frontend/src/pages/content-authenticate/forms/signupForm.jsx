/* eslint-disable react-hooks/rules-of-hooks */
// component
import LogoComponent from '../../../components/Logo/logo'
import InputComponet from '../../../components/content-input/input-full'
import OutlineButtonComponent from '../../../components/content-buttons/outline-button'
import ButtonFullComponent from '../../../components/content-buttons/full-button'
import GoogleIcon from '../../../assets/Icons/google-icon.png';
import FacebookIcon from '../../../assets/Icons/facebook-icon.png';
import { ToastifyError, ToastifySuccess } from '../../../components/content-alert/toastify';
import { createAgency } from '../../../slicers/authenticateSlicer';
import { useDispatch } from 'react-redux';

//libs
import { Link, useNavigate } from 'react-router-dom';
import {Divider} from 'antd';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const signupForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const authToken = Cookies.get('authToken');

    const handleSignup = async () => {
        try {
            setIsLoading(true);
            if (!firstName ||!lastName ||!email ||!password ||!confirmPassword) throw 'All fields are required';

            if (password!== confirmPassword) throw `passwords don't match`;
        
            let data = {
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            };
            
            const response = await dispatch(createAgency(data));

            if (response.payload.status === true) {
                await localStorage.setItem('email', email);
                await localStorage.setItem('password', password);
                ToastifySuccess({ lable: 'Account created successfully' });
                setConfirmPassword('');
                setEmail('');
                setFirstName('');
                setLastName('');
                setPassword('');
                setIsLoading(false);
                navigate('/authenticate/signin');
            } else {
                ToastifyError({ lable: 'create acount faild' });
            }
        } catch (error) {
            setIsLoading(false);
            ToastifyError({ lable: error });
        }
    };

    useEffect(() => {
        if (authToken) {
            navigate('/dashboard');
        }
    }, [authToken, navigate]);

    return (
        <div className="w-full my-10 px-[10px] xs:my-0 lg:my-0 ">
            <div className="font-primaryBold text-primary uppercase animate-fade-down animate-once animate-duration-1000 animate-delay-100 text-[25px]">
                <LogoComponent/>
            </div>
            <div className="font-primaryMedium text-[20px] animate-fade-down animate-once animate-duration-1000 xs:text-[18px]">
                <span>Create account</span>
            </div>
            <div className="my-[20px] animate-fade-left animate-once animate-duration-1000">
                <div className="flex justify-between gap-x-3 xs:flex-col xs:gap-y-5 sm:flex-col sm:gap-y-5 md:flex-col md:gap-y-5 lg:flex-col lg:gap-y-5">
                    <InputComponet color="blue" label="FirstName" value={firstName} OnChange={setFirstName} />
                    <InputComponet color="blue" label="LastName" value={lastName} OnChange={setLastName} />
                </div>
                <div className="my-5">
                    <InputComponet color="blue" label="Email" value={email} OnChange={setEmail} />
                </div>
                <div className="my-5">
                    <InputComponet type="password" color="blue" label="password" value={password} OnChange={setPassword} />
                </div>
                <div className="mt-5 mb-2">
                    <InputComponet type="password" color="blue" label="Confirm Password" value={confirmPassword} OnChange={setConfirmPassword} />
                </div>
            </div>
            <div className="animate-fade-up animate-once animate-duration-1000">
                <ButtonFullComponent color="blue" lable="Create account now" func={handleSignup} isLoading={isLoading} />
            </div>
            <div className="text-center mt-5 text-[14px] text-primary animate-fade-up animate-once animate-duration-1000 animate-delay-200  xs:mt-3 ">
                <Link to="/authenticate/signin">If you account already exists your can click me go to signin.</Link>
            </div>
            <div className="animate-once animate-duration-1000 animate-delay-200">
                <Divider plain>or</Divider>
            </div>
            <div className="flex justify-between gap-x-5 animate-fade-up animate-once animate-duration-1000 animate-delay-200 xs:flex-col xs:gap-y-5 lg:flex-col lg:gap-y-5">
                <OutlineButtonComponent otherStyle="flex items-center justify-center gap-x-2 w-full " color="blue" >
                    <img className="w-[20px]" src={GoogleIcon} alt="Logogoogle" />
                    Sign in with Google
                </OutlineButtonComponent>
                <OutlineButtonComponent otherStyle="flex items-center justify-center gap-x-2 w-full" color="blue">
                    <img className="w-[20px]" src={FacebookIcon} alt="Logofacebook" />
                    Sign in with Facebook
                </OutlineButtonComponent>
            </div>
        </div>
    )
}

export default signupForm