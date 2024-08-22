import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

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

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/check-auth`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsAuthenticated(true);
                    setUserRole(data.role);
                } else {
                    setIsAuthenticated(false);
                    navigate('/', { state: { error: 'Please log in to access this page.' } });
                }
            } catch (error) {
                console.error('Auth check error:', error);
                setIsAuthenticated(false);
                navigate('/', { state: { error: 'An error occurred. Please try again.' } });
            }
        };

        checkAuth();
    }, [navigate]);

    useEffect(() => {
        if (isAuthenticated && userRole) {
            const currentPath = location.pathname;
            const allowedItem = navItems.find(item => item.path === currentPath && item.roles.includes(userRole));
            
            if (!allowedItem) {
                Swal.fire({
                    icon: 'error',
                    title: 'Access Denied',
                    text: 'You do not have permission to access this page.',
                }).then(() => {
                    navigate('/dashboard');
                });
            }
        }
    }, [isAuthenticated, userRole, location, navigate]);

    if (isAuthenticated === null || userRole === null) {
        return <div>Loading...</div>; // Or a loading spinner
    }

    return isAuthenticated ? children : null;
};

export default ProtectedRoute;