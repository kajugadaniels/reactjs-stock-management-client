import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components';

const UserLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Header />
            <main className="px-4 mx-auto max-w-1xl sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
};

export default UserLayout;
