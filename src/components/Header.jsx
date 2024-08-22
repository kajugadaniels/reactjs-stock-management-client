import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { Icon } from '@iconify/react';
import axios from 'axios';
import Swal from 'sweetalert2';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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
        { path: '/stock', label: 'STOCK', icon: 'ph:cube-bold', roles: ['Manager', 'Storekeeper'] },
        { path: '/inventory', label: 'INVENTORY', icon: 'bi:layers', roles: ['Manager', 'Storekeeper', 'Production'] },
        { path: '/process', label: 'PROCESS', icon: 'fa-solid:cogs', roles: ['Manager', 'Production'] },
        { path: '/finished-stock', label: 'FINISHED PRODUCTS', icon: 'ri:product-hunt-fill', roles: ['Manager', 'Production'] },
        { path: '/product-stock-in', label: 'PRODUCT STOCK IN', icon: 'ri:product-hunt-line', roles: ['Manager', 'Production'] },
        { path: '/product-stock-out', label: 'PRODUCT STOCK OUT', icon: 'ri:product-hunt-fill', roles: ['Manager', 'Production'] },
    ];

    const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

    return (
        <nav className="fixed top-0 left-0 z-50 flex items-center justify-between w-full p-4 bg-gray-200 shadow dark:bg-card-foreground text-card-foreground dark:text-customgray">
            <div className="flex items-center space-x-4">
                <img src="images/logo.jpeg" alt="Jabana" className="w-10 h-10 rounded-full sm:w-14 sm:h-14" />
            </div>

            <ul className="items-center hidden ml-6 space-x-6 md:flex">
                {filteredNavItems.map((item, index) => (
                    <li key={index}>
                        <Link to={item.path} className={`flex items-center space-x-2 ${location.pathname === item.path ? activeLinkClass : inactiveLinkClass}`}>
                            <Icon icon={item.icon} width="1.3em" height="1.3em" />
                            <span>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="flex items-center space-x-4">
                <Dropdown show={isMenuOpen} onToggle={toggleMenu}>
                    <Dropdown.Toggle variant="transparent" id="dropdown-custom-components" className="p-0">
                        <div className='flex gap-5 items-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="#212d31" fillRule="evenodd" d="M8 7a4 4 0 1 1 8 0a4 4 0 0 1-8 0m0 6a5 5 0 0 0-5 5a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3a5 5 0 0 0-5-5z" clipRule="evenodd"></path></svg>
                            <span className='mt-2 semi-bold'>{userName}</span>
                        </div>
                    </Dropdown.Toggle>
                    {isMenuOpen && (
                        <Dropdown.Menu align="right" className="flex flex-col p-4 bg-white text-foreground w-64 rounded-lg shadow-lg mt-5">
                            <div className="flex items-center mb-4">
                                <span className="ml-2 text-lg font-semibold">{userName}</span>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Link to="/change-password" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    <Icon icon="mdi:key-change" className="mr-2" />
                                    Change Password
                                </Link>
                                <Dropdown.Item as="button" onClick={handleLogout} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                                    <Icon icon="mdi:power" className="mr-2" />
                                    Logout
                                </Dropdown.Item>
                            </div>
                        </Dropdown.Menu>
                    )}
                </Dropdown>

                <button onClick={toggleMenu} className="text-xl text-black focus:outline-none md:hidden">
                    <Icon icon={isMenuOpen ? "bi:justify" : "bi:justify-left"} />
                </button>
            </div>

            {isMenuOpen && (
                <ul className="absolute right-0 flex flex-col p-2 space-y-2 bg-gray-200 rounded-md shadow top-16 md:hidden dark:bg-card-foreground text-card-foreground dark:text-customgray">
                    {filteredNavItems.map((item, index) => (
                        <li key={index}>
                            <Link to={item.path} className={`flex items-center space-x-2 ${location.pathname === item.path ? activeLinkClass : inactiveLinkClass}`} onClick={toggleMenu}>
                                <Icon icon={item.icon} width="1.3em" height="1.3em" />
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
};

export default Header;