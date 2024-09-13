import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import Swal from 'sweetalert2';
import CreateUser from './users/CreateUser';
import EditUser from './users/EditUser';

const Users = () => {
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
            setLoading(false);
        }
    };

    const toggleCreateUserModal = () => {
        setIsCreateUserModalOpen(!isCreateUserModalOpen);
    };

    const toggleEditUserModal = () => {
        setIsEditUserModalOpen(!isEditUserModalOpen);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        toggleEditUserModal();
    };

    const handleDelete = async (userId) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            });

            if (result.isConfirmed) {
                await axios.delete(`${import.meta.env.VITE_API_URL}/users/${userId}`);
                Swal.fire('Deleted!', 'User has been deleted.', 'success');
                fetchUsers(); 
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            Swal.fire('Error', 'Failed to delete user', 'error');
        }
    };

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Role',
            selector: row => row.role,
            sortable: true,
        },
        {
            name: 'Actions',
            wrap: true,
            minWidth: '300px',
            cell: row => (
                <>
                    <button 
                        onClick={() => handleEdit(row)} 
                        className="px-4 py-1 mr-2 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => handleDelete(row.id)} 
                        className="px-4 py-1 text-sm font-medium text-red-600 hover:text-red-800 focus:outline-none"
                    >
                        Delete
                    </button>
                </>
            ),
        },
    ];

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#f3f4f6',
                borderBottom: '2px solid #e5e7eb',
            },
        },
        headCells: {
            style: {
                fontSize: '0.875rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                color: '#374151',
            },
        },
        rows: {
            style: {
                fontSize: '0.875rem',
                backgroundColor: 'white',
                '&:nth-of-type(odd)': {
                    backgroundColor: '#f9fafb',
                },
                '&:hover': {
                    backgroundColor: '#f3f4f6',
                },
                borderBottom: '1px solid #e5e7eb',
            },
        },
    };

    if (loading) return <div className="text-center mt-8">Loading users...</div>;
    if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

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
                <DataTable
                    columns={columns}
                    data={users}
                    pagination
                    highlightOnHover
                    striped
                    responsive
                    customStyles={customStyles}
                />
            </div>
            {isCreateUserModalOpen && <CreateUser isOpen={isCreateUserModalOpen} onClose={toggleCreateUserModal} onUserCreated={fetchUsers} />}
            {isEditUserModalOpen && <EditUser isOpen={isEditUserModalOpen} onClose={toggleEditUserModal} user={selectedUser} onUserUpdated={fetchUsers} />}
        </div>
    );
};

export default Users;