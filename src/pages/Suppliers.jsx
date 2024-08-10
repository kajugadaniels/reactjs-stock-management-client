import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import EmployeesCreate from './employees/EmployeesCreate';
import AddItemToSupplier from './suppliers/AddItemToSupplier';
import SupplierItems from './suppliers/SupplierItems';
import SuppliersCreate from './suppliers/SuppliersCreate';
import SuppliersEdit from './suppliers/SuppliersEdit';
import SupplierReport from './reports/SupplierReport';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSuppliersCreateOpen, setIsSuppliersCreateOpen] = useState(false);
    const [isSuppliersEditOpen, setIsSuppliersEditOpen] = useState(false);
    const [isSupplierItemsOpen, setIsSupplierItemsOpen] = useState(false);
    const [isAddItemToSupplierOpen, setIsAddItemToSupplierOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isEmployeesCreateOpen, setIsEmployeesCreateOpen] = useState(false);
    const [isReportFormOpen, setIsReportFormOpen] = useState(false);

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/suppliers`);
            setSuppliers(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
            setError('Failed to fetch suppliers. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleDeleteSupplier = async (id) => {
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
            try {
                await axios.delete(`${import.meta.env.VITE_API_URL}/suppliers/${id}`);
                Swal.fire('Deleted!', 'Supplier has been deleted.', 'success');
                fetchSuppliers();
            } catch (error) {
                console.error('Error deleting supplier:', error);
                Swal.fire('Error!', 'Failed to delete supplier.', 'error');
            }
        }
    };

    const columns = [
        {
            name: 'Supplier Id',
            selector: row => `supplier-${row.id}`,
            sortable: true,
        },
        {
            name: 'Names',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Contact',
            selector: row => row.contact,
            sortable: true,
        },
        {
            name: 'Address',
            selector: row => row.address,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <div className="flex space-x-2">
                    <button onClick={() => openSuppliersEditModal(row)} className="text-blue-600 hover:text-blue-800">
                        Edit
                    </button>
                    <button onClick={() => handleDeleteSupplier(row.id)} className="text-red-600 hover:text-red-800">
                        Delete
                    </button>
                    <button onClick={() => openSupplierItemsModal(row)} className="text-green-600 hover:text-green-800">
                        View Items
                    </button>
                    <button onClick={() => openAddItemToSupplierModal(row)} className="text-yellow-600 hover:text-yellow-800">
                        Add Item
                    </button>
                </div>
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

    const toggleSuppliersCreateModal = () => setIsSuppliersCreateOpen(!isSuppliersCreateOpen);
    const toggleEmployeesCreateModal = () => setIsEmployeesCreateOpen(!isEmployeesCreateOpen);
    const toggleReportForm = () => setIsReportFormOpen(!isReportFormOpen);

    const openSuppliersEditModal = (supplier) => {
        setSelectedSupplier(supplier);
        setIsSuppliersEditOpen(true);
    };

    const openSupplierItemsModal = (supplier) => {
        setSelectedSupplier(supplier);
        setIsSupplierItemsOpen(true);
    };

    const openAddItemToSupplierModal = (supplier) => {
        setSelectedSupplier(supplier);
        setIsAddItemToSupplierOpen(true);
    };

    if (loading) return <div className="mt-5 text-center">Loading...</div>;
    if (error) return <div className="mt-5 text-center text-red-500">{error}</div>;

    return (
        <div className="container py-32 mx-auto">
            <div className="flex flex-col mb-8 md:flex-row md:items-center md:justify-between">
                <h1 className="mb-4 text-3xl font-semibold text-gray-800 md:mb-0">Suppliers Management</h1>
                <div className="flex space-x-2">
                    <button onClick={toggleSuppliersCreateModal} className="bg-[#00BDD6] text-white px-4 py-2 rounded-md">
                        Add Supplier
                    </button>
                    <button onClick={toggleEmployeesCreateModal} className="bg-[#00BDD6] text-white px-4 py-2 rounded-md">
                        Add Employee
                    </button>
                    <button onClick={toggleReportForm} className="bg-[#00BDD6] text-white px-4 py-2 rounded-md">
                        Generate Report
                    </button>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow">
                <DataTable
                    columns={columns}
                    data={suppliers}
                    pagination
                    responsive
                    highlightOnHover
                    pointerOnHover
                    customStyles={customStyles}
                />
            </div>

            {isSuppliersCreateOpen && <SuppliersCreate isOpen={isSuppliersCreateOpen} onClose={toggleSuppliersCreateModal} onSupplierCreated={fetchSuppliers} />}
            {isSuppliersEditOpen && <SuppliersEdit isOpen={isSuppliersEditOpen} onClose={() => setIsSuppliersEditOpen(false)} supplier={selectedSupplier} onSupplierUpdated={fetchSuppliers} />}
            {isSupplierItemsOpen && <SupplierItems isOpen={isSupplierItemsOpen} onClose={() => setIsSupplierItemsOpen(false)} supplier={selectedSupplier} />}
            {isAddItemToSupplierOpen && <AddItemToSupplier isOpen={isAddItemToSupplierOpen} onClose={() => setIsAddItemToSupplierOpen(false)} supplier={selectedSupplier} />}
            {isEmployeesCreateOpen && <EmployeesCreate isOpen={isEmployeesCreateOpen} onClose={toggleEmployeesCreateModal} />}
            {isReportFormOpen && <SupplierReport onClose={toggleReportForm} />}
        </div>
    );
};

export default Suppliers;