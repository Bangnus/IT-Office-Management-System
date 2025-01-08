import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

const PrivateRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const authToken = Cookies.get('authToken');
        // funct checkToeknExpiration
        const checkToeknExpiration = async () => {
            try {
                const decodedToken = jwtDecode(authToken);
                const currentTime = new Date().getTime() / 1000;
                setIsAuthenticated(decodedToken.exp <= currentTime);
                if (isAuthenticated) {
                    console.log('✨ Unauthorized to access this page. Please signin again. Redirecting to signin page...');
                    Cookies.remove('authToken');
                    navigate('/authenticate/signin');
                }
            // eslint-disable-next-line no-unused-vars
            } catch (error) {
                console.log('✨ Unauthorized to access this page. Please signin again. Redirecting to signin page...');
                setIsAuthenticated(false);
                navigate('/authenticate/signin');
            }
        };

        checkToeknExpiration();
    }, [isAuthenticated, navigate]);

    const isAuthenticate = useAuth().token;
    if (!isAuthenticate || isAuthenticate === "") return <Navigate to='/authenticate/signin' />;
    return <Outlet />;
};

export default PrivateRoute;