import PropTypes from 'prop-types';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';

const APP_NAME = 'IT Office Management System';

/** Layout for public pages (sign in / sign up). */
const MasterLayout = ({ children, title }) => {
    useEffect(() => {
        document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
    }, [title]);

    return (
        <>
            <main>{children}</main>
            <ToastContainer position="top-right" autoClose={3500} newestOnTop />
        </>
    );
};

MasterLayout.propTypes = {
    children: PropTypes.node.isRequired,
    Navlight: PropTypes.bool,
    title: PropTypes.string,
};

export default MasterLayout;
