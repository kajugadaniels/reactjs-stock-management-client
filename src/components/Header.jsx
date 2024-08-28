import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [userName, setUserName] = useState('User');
    const [userRole, setUserRole] = useState('');
    const activeLinkClass = "text-[#00BDD6] border-b-2 border-[#00BDD6]";
    const inactiveLinkClass = "text-black";

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.name) {
            setUserName(user.name);
            setUserRole(user.role);
        }
    }, []);

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
        if (isProfileOpen) setIsProfileOpen(false);
    };

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
        if (isNavOpen) setIsNavOpen(false);
    };

    const handleLogout = async (event) => {
        event.preventDefault();

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/logout`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            localStorage.removeItem('token');
            localStorage.removeItem('user');

            Swal.fire({
                icon: 'success',
                title: 'Logged Out',
                text: 'You have been successfully logged out.',
            });

            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
            Swal.fire({
                icon: 'error',
                title: 'Logout Failed',
                text: 'An error occurred while logging out. Please try again.',
            });
        }
    };

    const navItems = [
        { path: '/dashboard', label: 'DASHBOARD', icon: 'ic:baseline-dashboard', roles: ['Manager', 'Production', 'Storekeeper'] },
        { path: '/users', label: 'USERS', icon: 'ic:baseline-person', roles: ['Manager'] },
        { path: '/items', label: 'ITEMS', icon: 'mdi:cart', roles: ['Manager'] },
        { path: '/suppliers', label: 'SUPPLIERS', icon: 'tabler:stack', roles: ['Manager', 'Storekeeper'] },
        { path: '/stock', label: 'STOCK', icon: 'ph:cube-bold', roles: ['Manager', 'Storekeeper', 'Production'] },
        { path: '/inventory', label: 'INVENTORY', icon: 'bi:layers', roles: ['Manager', 'Storekeeper', 'Production'] },
        { path: '/process', label: 'PROCESS', icon: 'fa-solid:cogs', roles: ['Manager', 'Production'] },
        { path: '/finished-stock', label: 'FINISHED PRODUCTS', icon: 'ri:product-hunt-fill', roles: ['Manager', 'Production'] },
        { path: '/product-stock-in', label: 'PRODUCT STOCK IN', icon: 'ri:product-hunt-line', roles: ['Manager', 'Production'] },
        { path: '/product-stock-out', label: 'PRODUCT STOCK OUT', icon: 'ri:product-hunt-fill', roles: ['Manager', 'Production'] },
    ];

    const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

    return (
        <nav className="fixed top-0 left-0 z-50 flex flex-wrap items-center justify-between w-full p-4 bg-gray-200 shadow dark:bg-card-foreground text-card-foreground dark:text-customgray">
            <div className="flex items-center space-x-4">
                <img src="images/logo.jpeg" alt="Jabana" className="w-10 h-10 rounded-full sm:w-14 sm:h-14" />
            </div>

            <div className="flex items-center md:order-2">
                <button onClick={toggleProfile} className="flex items-center space-x-2 focus:outline-none">
                    <Icon icon="mdi:account-circle" width="2em" height="2em" />
                    <span className="hidden md:inline">{userName}</span>
                </button>
                <button onClick={toggleNav} className="p-2 ml-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                    <Icon icon={isNavOpen ? "ic:round-close" : "ic:round-menu"} width="1.5em" height="1.5em" />
                </button>
            </div>

            <div className={`${isNavOpen ? 'block' : 'hidden'} w-full md:block md:w-auto md:order-1`}>
                <ul className="flex flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg md:p-0 bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-transparent">
                    {filteredNavItems.map((item, index) => (
                        <li key={index}>
                            <Link 
                                to={item.path} 
                                className={`flex items-center py-2 pl-3 pr-4 ${location.pathname === item.path ? activeLinkClass : inactiveLinkClass} rounded md:p-0`}
                                onClick={() => setIsNavOpen(false)}
                            >
                                <Icon icon={item.icon} width="1.3em" height="1.3em" className="mr-2" />
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {isProfileOpen && (
                <div className="absolute right-0 z-10 w-48 py-2 mt-2 bg-white rounded-md shadow-xl top-16">
                    <Link to="/change-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsProfileOpen(false)}>
                        Change Password
                    </Link>
                    <button onClick={handleLogout} className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100">
                        Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Header;