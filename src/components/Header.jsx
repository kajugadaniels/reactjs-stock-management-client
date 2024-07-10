import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu toggle
    const activeLinkClass = "text-[#00BDD6] border-b-2 border-[#00BDD6]";
    const inactiveLinkClass = "text-black";

    // Function to toggle menu state
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav className="flex items-center p-2 bg-gray-200 shadow dark:bg-card-foreground text-card-foreground dark:text-customgray">
            <div className="flex items-center space-x-4">
                <img src="images/logo.jpeg" alt="Jabana" className="rounded-full w-14 h-14" />
            </div>
            {/* Menu for larger screens */}
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
            
            {/* Menu toggle for small screens */}
            <div className="ml-auto md:hidden">
                <button onClick={toggleMenu} className="text-xl text-black focus:outline-none">
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
            
            {/* Search input */}
            <div className="hidden ml-auto md:block">
                <input type="text" placeholder="Search..." className="px-4 py-1 border rounded-md bg-input text-input-foreground border-border sm:rounded-full" />
            </div>
        </nav>
    );
}

export default Header;
