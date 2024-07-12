import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components';
import ProtectedRoute from '../context/ProtectedRoute';

const UserLayout = () => {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-100">
                <Header />
                <main className="px-4 mx-auto max-w-1xl sm:px-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default UserLayout;
