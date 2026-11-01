import PropTypes from 'prop-types';
import NavOfDash from './nav';
import { ToastContainer } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../../../slicers/authenticateSlicer';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import SliderComponent from './slider';

const APP_NAME = 'IT Office Management System';

const initialsOf = (user) => {
    if (!user) return null;
    const parts = [user.firstName, user.lastName].filter(Boolean);
    return parts.map((p) => p.trim().charAt(0)).join('').slice(0, 2) || null;
};

/**
 * Dashboard shell: sidebar (collapsible on desktop, drawer on screens up to 1023px),
 * top bar, and the page header (title, optional description and actions).
 */
const DashMasterLayout = ({ children, title, description, actions, back }) => {
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.currentUser);
    const currentAgent = currentUser?.data ?? null;
    const isFetching = useRef(false);
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(Cookies.get('sliderSize') === 'true');
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
        Cookies.set('lastPath', location.pathname);
    }, [title, location]);

    useEffect(() => {
        if (currentUser || !Cookies.get('authToken') || isFetching.current) return;
        isFetching.current = true;
        dispatch(fetchCurrentUser()).finally(() => { isFetching.current = false; });
    }, [dispatch, currentUser]);

    // Close the drawer on navigation and with Escape; lock page scroll while it is open
    useEffect(() => { setDrawerOpen(false); }, [location.pathname]);
    useEffect(() => {
        if (!drawerOpen) return;
        const onKey = (e) => e.key === 'Escape' && setDrawerOpen(false);
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [drawerOpen]);

    const toggleCollapsed = () => {
        setCollapsed((c) => {
            Cookies.set('sliderSize', String(!c));
            return !c;
        });
    };

    return (
        <div className='min-h-screen bg-ink-50 text-ink-800'>
            {/* Desktop sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 border-r border-ink-200 transition-[width] duration-200 ease-out lg:hidden ${collapsed ? 'w-[76px]' : 'w-64'}`}>
                <SliderComponent collapsed={collapsed} onToggle={toggleCollapsed} />
            </aside>

            {/* Mobile / tablet drawer */}
            <div className={`fixed inset-0 z-50 hidden lg:block ${drawerOpen ? '' : 'pointer-events-none'}`} aria-hidden={!drawerOpen}>
                <div
                    className={`absolute inset-0 bg-ink-900/40 transition-opacity duration-200 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setDrawerOpen(false)}
                />
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label="เมนู"
                    className={`absolute inset-y-0 left-0 w-[280px] max-w-[85vw] shadow-pop transition-transform duration-200 ease-out ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <SliderComponent inDrawer onClose={() => setDrawerOpen(false)} />
                </div>
            </div>

            <div className={`flex min-h-screen min-w-0 flex-col transition-[padding] duration-200 ease-out lg:pl-0 ${collapsed ? 'pl-[76px]' : 'pl-64'}`}>
                <NavOfDash userData={currentAgent} avatarName={initialsOf(currentAgent)} onOpenMenu={() => setDrawerOpen(true)} />
                <main className='mx-auto w-full min-w-0 max-w-[1400px] flex-1 px-8 py-7 lg:px-6 md:px-4 md:py-5'>
                    {(title || actions) && (
                        <div className='mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-3 md:mb-5'>
                            <div className='min-w-0'>
                                {back}
                                {title && <h1 className='text-2xl font-semibold tracking-tight text-ink-900 md:text-xl'>{title}</h1>}
                                {description && <p className='mt-1 text-sm text-ink-500'>{description}</p>}
                            </div>
                            {actions && <div className='flex flex-wrap items-center gap-2'>{actions}</div>}
                        </div>
                    )}
                    {children}
                </main>
            </div>
            <ToastContainer position="top-right" autoClose={3500} newestOnTop />
        </div>
    );
};

DashMasterLayout.propTypes = {
    children: PropTypes.any,
    title: PropTypes.string,
    description: PropTypes.node,
    actions: PropTypes.node,
    back: PropTypes.node,
    path: PropTypes.any,
};

export default DashMasterLayout;
