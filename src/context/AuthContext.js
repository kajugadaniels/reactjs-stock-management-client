import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ token: null, name: null });
    const navigate = useNavigate();

    useEffect(() => {
        // Check localStorage for existing token
        const storedToken = localStorage.getItem('authToken');
        const storedName = localStorage.getItem('authName');

        if (storedToken && storedName) {
            setAuth({ token: storedToken, name: storedName });
        }
    }, []);

    const login = (token, name) => {
        setAuth({ token, name });
        localStorage.setItem('authToken', token);
        localStorage.setItem('authName', name);
    };

    const logout = () => {
        setAuth({ token: null, name: null });
        localStorage.removeItem('authToken');
        localStorage.removeItem('authName');
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
