import React, { useEffect, useState } from 'react';
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
            hide: 'sm',
        },
        {
            name: 'Address',
            selector: row => row.address,
            sortable: true,
            hide: 'md',
        },
        {
            name: 'Action',
            cell: (row) => (
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <button onClick={() => openSuppliersEditModal(row)} className="px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded hover:bg-blue-200">
                        Edit
                    </button>
                    <button onClick={() => openSupplierItemsModal(row)} className="px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded hover:bg-green-200">
                        View Items
                    </button>
                    <button onClick={() => openAddItemToSupplierModal(row)} className="px-2 py-1 text-xs font-semibold text-yellow-600 bg-yellow-100 rounded hover:bg-yellow-200">
                        Add Item
                    </button>
                </div>
            ),
            grow: 2,
        }
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
            },
        },
        cells: {
            style: {
                padding: '12px 8px',
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
        <div className="container py-8 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col mb-8 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mt-20">
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">Suppliers Management</h1>
                <div className="flex flex-wrap gap-2">
                    <button onClick={toggleSuppliersCreateModal} className="w-full sm:w-auto bg-[#00BDD6] text-white px-4 py-2 rounded-md text-sm">
                        Add Supplier
                    </button>
                    <button onClick={toggleEmployeesCreateModal} className="w-full sm:w-auto bg-[#00BDD6] text-white px-4 py-2 rounded-md text-sm">
                        Add Employee
                    </button>
                    <button onClick={toggleReportForm} className="w-full sm:w-auto bg-[#00BDD6] text-white px-4 py-2 rounded-md text-sm">
                        Generate Report
                    </button>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
                <DataTable
                    columns={columns}
                    data={suppliers}
                    pagination
                    responsive
                    highlightOnHover
                    pointerOnHover
                    customStyles={customStyles}
                    noHeader
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