import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const activeLinkClass = "text-[#00BDD6] border-b-2 border-[#00BDD6]";
    const inactiveLinkClass = "text-black";

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const handleLogout = async (event) => {
        event.preventDefault();

        try {
            await fetch('/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            // Clear any authentication tokens or data
            localStorage.removeItem('auth_token');

            // Redirect to login page
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className="flex items-center justify-between p-4 bg-gray-200 shadow dark:bg-card-foreground text-card-foreground dark:text-customgray">
            <div className="flex items-center space-x-4">
                <img src="images/logo.jpeg" alt="Jabana" className="w-10 h-10 rounded-full sm:w-14 sm:h-14" />
            </div>

            <ul className="items-center hidden ml-6 space-x-6 md:flex">
                {['/dashboard', '/items', '/suppliers', '/stock', '/inventory', '/process', '/finished-products', '/product-stock-in', '/product-stock-out'].map((path, index) => (
                    <li key={index}>
                        <Link to={path} className={`flex items-center space-x-2 ${location.pathname === path ? activeLinkClass : inactiveLinkClass}`}>
                            <Icon icon={getIconForPath(path)} width="1.3em" height="1.3em" />
                            <span>{getLabelForPath(path)}</span>
                        </Link>
                    </li>
                ))}
            </ul>

            <div className="flex items-center space-x-4">
                <Dropdown>
                    <Dropdown.Toggle variant="transparent" id="dropdown-custom-components" className="p-0">
                        <img src="images/logo.jpeg" alt="Profile" className="w-8 h-8 rounded-full sm:w-10 sm:h-10" style={{ border: '2px solid gray' }} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="right" className="flex flex-col p-4 bg-white text-foreground w-64 rounded-lg shadow-lg">
                        <div className="flex items-center mb-4">
                            <span className="ml-2 text-lg font-semibold">James Aldrino</span>
                        </div>
                        <div className="flex flex-col space-y-2">

                            <form method="POST" action="/logout" className="flex items-center justify-between p-2 rounded-lg hover:bg-muted" onSubmit={handleLogout}>
                                {csrfToken && <input type="hidden" name="_token" value={csrfToken} />}
                                <Dropdown.Item as="button" type="submit" className="w-full text-left flex items-center">
                                    <div className='flex gap-5'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="none" stroke="#43badb" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 6.5C4.159 8.148 3 10.334 3 13a9 9 0 1 0 18 0c0-2.666-1.159-4.852-3-6.5M12 2v9m0-9c-.7 0-2.008 1.994-2.5 2.5M12 2c.7 0 2.008 1.994 2.5 2.5" color="#43badb"></path></svg>
                                        Logout
                                    </div>
                                </Dropdown.Item>

                            </form>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>


                <button onClick={toggleMenu} className="text-xl text-black focus:outline-none md:hidden">
                    <Icon icon={isMenuOpen ? "bi:justify" : "bi:justify-left"} />
                </button>
            </div>

            {isMenuOpen && (
                <ul className="absolute right-0 flex flex-col p-2 space-y-2 bg-gray-200 rounded-md shadow top-16 md:hidden dark:bg-card-foreground text-card-foreground dark:text-customgray">
                    {['/dashboard', '/items', '/suppliers', '/stock', '/inventory', '/process', '/finished-products', '/product-stock-in', '/product-stock-out'].map((path, index) => (
                        <li key={index}>
                            <Link to={path} className={`flex items-center space-x-2 ${location.pathname === path ? activeLinkClass : inactiveLinkClass}`} onClick={toggleMenu}>
                                <Icon icon={getIconForPath(path)} width="1.3em" height="1.3em" />
                                <span>{getLabelForPath(path)}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </nav>
    );
};

const getIconForPath = (path) => {
    switch (path) {
        case '/dashboard':
            return "ic:baseline-dashboard";
        case '/items':
            return "mdi:cart";
        case '/suppliers':
            return "tabler:stack";
        case '/stock':
            return "ph:cube-bold";
        case '/inventory':
            return "bi:layers";
        case '/process':
            return "fa-solid:cogs";
        case '/finished-products':
            return "ri:product-hunt-fill";
        case '/product-stock-in':
            return "ri:product-hunt-line";
        case '/product-stock-out':
            return "ri:product-hunt-fill";
        default:
            return "";
    }
};

const getLabelForPath = (path) => {
    switch (path) {
        case '/dashboard':
            return "DASHBOARD";
        case '/items':
            return "ITEMS";
        case '/suppliers':
            return "SUPPLIERS";
        case '/stock':
            return "STOCK";
        case '/inventory':
            return "Inventory";
        case '/process':
            return "PROCESS";
        case '/finished-products':
            return "FINISHED PRODUCTS";
        case '/product-stock-in':
            return "PRODUCT STOCK IN";
        case '/product-stock-out':
            return "PRODUCT STOCK OUT";
        default:
            return "";
    }
};

export default Header;
