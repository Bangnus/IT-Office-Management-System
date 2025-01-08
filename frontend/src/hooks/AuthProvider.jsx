import { useContext, createContext, useState } from "react";
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from "react-redux";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { authenticateAgency } from "../slicers/authenticateSlicer";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentAgency = useSelector((state) => state.auth.currentAgency);
    const [token, setToken] = useState(Cookies.get('authToken') || "");

    const SiginAction = async (data) => {
        try {
            const response = await dispatch(authenticateAgency(data));
            if (response.payload.status === true) {
                return { status: true };
            }
        } catch (error) {
            return console.log(error);
        }
    };

    const SignoutAction = () => {
        setToken('');
        Cookies.remove('authToken');
        navigate('/authenticate/signin');
    };

    return(
        <AuthContext.Provider value={{ SiginAction, SignoutAction, token, currentAgency }}>
            {children}
        </ AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node,
};

export default AuthProvider;

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
}