import React, { useState } from 'react';
import CreateUser from './users/CreateUser';

const Users = () => {
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

    const toggleCreateUserModal = () => {
        setIsCreateUserModalOpen(!isCreateUserModalOpen);
    };

    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    ];

    return (
        <div className="container py-32 mx-auto">
            <div className="flex flex-col mb-8 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <h1 className="text-3xl font-semibold text-gray-800">Users Management</h1>
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                    <button
                        onClick={toggleCreateUserModal}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#00BDD6] rounded-md hover:bg-[#00a8c2] focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:ring-offset-2"
                    >
                        Add User
                    </button>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">Name</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">Email</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">Role</th>
                            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left" >Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.role}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <button className="px-4 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none">
                                        Edit
                                    </button>
                                    <button className="px-4 py-1 text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isCreateUserModalOpen && <CreateUser isOpen={isCreateUserModalOpen} onClose={toggleCreateUserModal} />}
        </div>
    );
};

export default Users;
