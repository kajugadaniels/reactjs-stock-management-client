import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';

const EmployeesCreate = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        position: ''
    });
    const [loading, setLoading] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [expandedRows, setExpandedRows] = useState({});

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/employees`);
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            Swal.fire('Error', 'Failed to fetch employees', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingEmployee) {
                await axios.put(`${import.meta.env.VITE_API_URL}/employees/${editingEmployee.id}`, formData);
                Swal.fire('Success', 'Employee updated successfully!', 'success');
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/employees`, formData);
                Swal.fire('Success', 'Employee created successfully!', 'success');
            }
            fetchEmployees();
            setFormData({ name: '', contact: '', position: '' });
            setEditingEmployee(null);
        } catch (error) {
            Swal.fire('Error', error.response?.data?.message || 'Failed to save employee', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (employee) => {
        setEditingEmployee(employee);
        setFormData({
            name: employee.name,
            contact: employee.contact,
            position: employee.position
        });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will soft delete the employee. Their data will be retained in other tables.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/employees/${id}`);
                Swal.fire('Deleted!', 'The employee has been deleted.', 'success');
                fetchEmployees();
            } catch (error) {
                Swal.fire('Error', 'Failed to delete the employee', 'error');
            }
        }
    };

    const toggleRowExpansion = useCallback((row) => {
        setExpandedRows(prev => ({ ...prev, [row.id]: !prev[row.id] }));
    }, []);

    const columns = useMemo(() => [
        {
            name: '',
            width: '50px',
            cell: row => (
                <button onClick={() => toggleRowExpansion(row)} className="w-full h-full flex items-center justify-center">
                    {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{
                            transform: expandedRows[row.id] ? 'rotate(90deg)' : 'rotate(0deg)',
                            transition: 'transform 0.2s ease-in-out'
                        }}
                    >
                        <polyline points="9 18 15 12 9 6" />
                    </svg> */}
                </button>
            ),
            omit: !isMobile,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Contact',
            selector: row => row.contact,
            sortable: true,
        },
        {
            name: 'Position',
            selector: row => row.position,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <>
                    <button 
                        onClick={() => handleEdit(row)} 
                        className="px-2 py-1 mr-2 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => handleDelete(row.id)} 
                        className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600"
                    >
                        Delete
                    </button>
                </>
            ),
            omit: isMobile,
        },
    ], [expandedRows, toggleRowExpansion, isMobile]);

    const ExpandedComponent = ({ data }) => (
        <div className="p-4 bg-gray-50">
            <div className="flex justify-end space-x-2">
                <button 
                    onClick={() => handleEdit(data)} 
                    className="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    Edit
                </button>
                <button 
                    onClick={() => handleDelete(data.id)} 
                    className="px-2 py-1 text-xs font-medium text-white bg-red-500 rounded hover:bg-red-600"
                >
                    Delete
                </button>
            </div>
        </div>
    );

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
                padding: '12px 8px',
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
                minHeight: 'auto',
            },
        },
        cells: {
            style: {
                padding: '12px 8px',
                whiteSpace: 'normal',
            },
        },
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-4xl p-8 bg-white rounded-lg shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">
                    {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="contact">Contact</label>
                            <input
                                type="text"
                                id="contact"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                required
                            />
                        </div>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="position">Position</label>
                            <input
                                type="text"
                                id="position"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex justify-end mt-4 space-x-4">
                        <button
                            type="button"
                            onClick={() => {
                                setEditingEmployee(null);
                                setFormData({ name: '', contact: '', position: '' });
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-[#00BDD6] rounded-md hover:bg-[#00a8c2] focus:outline-none focus:ring-2 focus:ring-[#00BDD6]"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : (editingEmployee ? 'Update Employee' : 'Save Employee')}
                        </button>
                    </div>
                </form>

                <DataTable
                    columns={columns}
                    data={employees}
                    pagination
                    highlightOnHover
                    striped
                    responsive
                    customStyles={customStyles}
                    expandableRows={isMobile}
                    expandableRowsComponent={ExpandedComponent}
                    expandableRowExpanded={row => expandedRows[row.id]}
                    onRowExpandToggled={(expanded, row) => toggleRowExpansion(row)}
                />

                <div className="mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmployeesCreate;