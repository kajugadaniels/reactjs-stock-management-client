import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();

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
                    setIsAuthenticated(true);
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

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Or a loading spinner
    }

    return isAuthenticated ? children : null;
};

export default ProtectedRoute;