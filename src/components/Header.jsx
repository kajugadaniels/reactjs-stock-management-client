import { Icon } from '@iconify/react';
import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const activeLinkClass = "text-[#00BDD6] border-b-2 border-[#00BDD6]";
    const inactiveLinkClass = "text-black";

    // Function to toggle menu state
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="flex justify-between items-center p-2 bg-gray-200 shadow dark:bg-card-foreground text-card-foreground dark:text-customgray">
            <div className="flex items-center space-x-4">
                <img src="images/logo.jpeg" alt="Jabana" className="rounded-full w-14 h-14" />
            </div>


            <ul className="items-center hidden ml-6 space-x-6 md:flex">
                <li>
                    <Link to="/dashboard" className={`flex items-center space-x-2 ${location.pathname === '/dashboard' ? activeLinkClass : inactiveLinkClass}`}>
                        <Icon icon="ic:baseline-dashboard" width="1.3em" height="1.3em" />
                        <span>Dashboard</span>
                    </Link>
                </li>
                <li>
                    <Link to="/items" className={`flex items-center space-x-2 ${location.pathname === '/items' ? activeLinkClass : inactiveLinkClass}`}>
                        <Icon icon="mdi:cart" width="1.2em" height="1.2em" />
                        <span>Items</span>
                    </Link>
                </li>
                <li>
                    <Link to="/suppliers" className={`flex items-center space-x-2 ${location.pathname === '/suppliers' ? activeLinkClass : inactiveLinkClass}`}>
                        <Icon icon="tabler:stack" width="1.3em" height="1.3em" />
                        <span>Suppliers</span>
                    </Link>
                </li>
                <li>
                    <Link to="/products" className={`flex items-center space-x-2 ${location.pathname === '/stock' ? activeLinkClass : inactiveLinkClass}`}>
                        <Icon icon="ph:cube-bold" width="1.3em" height="1.3em" />
                        <span>Stock</span>
                    </Link>
                </li>
                <li>
                    <Link to="/inventory" className={`flex items-center space-x-2 ${location.pathname === '/inventory' ? activeLinkClass : inactiveLinkClass}`}>
                        <Icon icon="bi:layers" width="1.3em" height="1.3em" />
                        <span>Inventory</span>
                    </Link>
                </li>
                <li>
                    <Link to="/process" className={`flex items-center space-x-2 ${location.pathname === '/process' ? activeLinkClass : inactiveLinkClass}`}>
                        <Icon icon="fa-solid:cogs" width="1.3em" height="1.3em" />
                        <span>Process</span>
                    </Link>
                </li>
                <li>
                    <Link to="/product-stock-in" className={`flex items-center space-x-2 ${location.pathname === '/product-stock-in' ? activeLinkClass : inactiveLinkClass}`}>
                        <Icon icon="ri:product-hunt-line" width="1.3em" height="1.3em" />
                        <span>Product Stock In</span>
                    </Link>
                </li>
                <li>
                    <Link to="/product-stock-out" className={`flex items-center space-x-2 ${location.pathname === '/product-stock-out' ? activeLinkClass : inactiveLinkClass}`}>
                        <Icon icon="ri:product-hunt-fill" width="1.3em" height="1.3em" />
                        <span>Product Stock Out</span>
                    </Link>
                </li>
            </ul>

            <div className="flex-grow flex items-center justify-end space-x-4">
                <input type="text" placeholder="Search..." className="px-4 py-1 border rounded-md bg-input text-input-foreground border-border sm:rounded-full" />
                {/* Profile dropdown next to the search bar */}
                <Dropdown>
                    <Dropdown.Toggle variant="transparent" id="dropdown-custom-components" className="p-0">
                        <img src="images/logo.jpeg" alt="Profile" className="w-10 h-10 rounded-full" style={{ border: '2px solid gray' }} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="right" className="w-full">
                        <Dropdown.Item as={Link} to="/profile" className="block w-full text-left px-3 py-2 hover:bg-gray-100">Profile</Dropdown.Item>
                        <Dropdown.Item as={Link} to="/logout" className="block w-full text-left px-3 py-2 hover:bg-gray-100">Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>


         

            {/* Menu toggle for small screens */}
            <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-xl text-black focus:outline-none">
                    <Icon icon={isMenuOpen ? "bi:justify" : "bi:justify-left"} />
                </button>
            </div>
            
            {/* Responsive menu */}

            {isMenuOpen && (
                <ul className="absolute right-0 flex flex-col p-2 space-y-2 bg-gray-200 rounded-md shadow md:hidden top-16 dark:bg-card-foreground text-card-foreground dark:text-customgray">
                    <li>
                        <Link to="/dashboard" className={`flex items-center space-x-2 ${location.pathname === '/dashboard' ? activeLinkClass : inactiveLinkClass}`}>
                            <Icon icon="ic:baseline-dashboard" width="1.3em" height="1.3em" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/items" className={`flex items-center space-x-2 ${location.pathname === '/items' ? activeLinkClass : inactiveLinkClass}`}>
                            <Icon icon="mdi:cart" width="1.2em" height="1.2em" />
                            <span>Items</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/suppliers" className={`flex items-center space-x-2 ${location.pathname === '/suppliers' ? activeLinkClass : inactiveLinkClass}`}>
                            <Icon icon="tabler:stack" width="1.3em" height="1.3em" />
                            <span>Suppliers</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/stock" className={`flex items-center space-x-2 ${location.pathname === '/stock' ? activeLinkClass : inactiveLinkClass}`}>
                            <Icon icon="ph:cube-bold" width="1.3em" height="1.3em" />
                            <span>Stock</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/inventory" className={`flex items-center space-x-2 ${location.pathname === '/inventory' ? activeLinkClass : inactiveLinkClass}`}>
                            <Icon icon="bi:layers" width="1.3em" height="1.3em" />
                            <span>Inventory</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/process" className={`flex items-center space-x-2 ${location.pathname === '/process' ? activeLinkClass : inactiveLinkClass}`}>
                            <Icon icon="fa-solid:cogs" width="1.3em" height="1.3em" />
                            <span>Process</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/product-stock-in" className={`flex items-center space-x-2 ${location.pathname === '/product-stock-in' ? activeLinkClass : inactiveLinkClass}`}>
                            <Icon icon="ri:product-hunt-line" width="1.3em" height="1.3em" />
                            <span>Product Stock In</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/product-stock-out" className={`flex items-center space-x-2 ${location.pathname === '/product-stock-out' ? activeLinkClass : inactiveLinkClass}`}>
                            <Icon icon="ri:product-hunt-fill" width="1.3em" height="1.3em" />
                            <span>Product Stock Out</span>
                        </Link>
                    </li>
                </ul>
            )}



            {isMenuOpen && (
                <ul className="absolute right-0 flex flex-col p-2 space-y-2 bg-gray-200 rounded-md shadow md:hidden top-16 dark:bg-card-foreground text-card-foreground dark:text-customgray">
                    {/* Responsive menu items repeated from the desktop menu */}
                </ul>
            )}
        </nav>
    );
}

export default Header;
