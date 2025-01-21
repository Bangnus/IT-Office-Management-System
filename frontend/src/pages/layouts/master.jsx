import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { ToastContainer } from 'react-toastify';

import { useEffect } from 'react';

const MasterLayout = ({ children, Navlight, title }) => {

    useEffect(() => {
        document.title = `${title === undefined ? 'IT OFFICE MANNENTMENT SYSTEM' : `${title} | IT OFFICE MANNENTMENT SYSTEM`}`;
    }, [title]);

    return (
        <>
            <div className='duration-200 font-primaryRegular'>
                {/* <Navbar lightNav={Navlight} /> */}
                <main>
                    {children}
                </main>
                {/* <Footer /> */}
                <ToastContainer />
            </div>
        </>
    );
};

MasterLayout.propTypes = {
    children: PropTypes.node.isRequired,
    Navlight: PropTypes.bool,
    title: PropTypes.string,
};

export default MasterLayout;