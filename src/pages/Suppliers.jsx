import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { FaEdit, FaEye, FaPlus } from 'react-icons/fa';
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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
            wrap: true,
            minWidth: '130px',
        },
        {
            name: 'Names',
            selector: row => row.name,
            sortable: true,
            wrap: true,
            minWidth: '150px',
        },
        {
            name: 'Contact',
            selector: row => row.contact,
            sortable: true,
            wrap: true,
            minWidth: '130px',
        },
        {
            name: 'Address',
            selector: row => row.address,
            sortable: true,
            wrap: true,
            minWidth: '150px',
        },
        {
            name: 'Action',
            wrap: true,
            minWidth: '200px',
            cell: (row) => (
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <button onClick={() => openSuppliersEditModal(row)} className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded hover:bg-blue-200 w-14">
                        Edit
                    </button>
                    <button onClick={() => openSupplierItemsModal(row)} className="px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded hover:bg-green-200 w-14">
                        View Items
                    </button>
                    <button onClick={() => openAddItemToSupplierModal(row)} className="px-2 py-1 text-xs font-semibold text-yellow-600 bg-yellow-100 rounded hover:bg-yellow-200 w-14">
                        Add Item
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
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
                padding: '20px 20px',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
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

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSuppliers = suppliers.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
        const pageCount = Math.ceil(totalItems / itemsPerPage);
        const lastPage = pageCount;
        const pageRange = 5;

        let startPage = Math.max(1, currentPage - Math.floor(pageRange / 2));
        let endPage = Math.min(lastPage, startPage + pageRange - 1);

        if (endPage - startPage + 1 < pageRange) {
            startPage = Math.max(1, endPage - pageRange + 1);
        }

        const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

        return (
            <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === lastPage}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
                            <span className="font-medium">{totalItems}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                                onClick={() => paginate(1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                                <span className="sr-only">First</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {pageNumbers.map(number => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                        currentPage === number
                                            ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                    }`}
                                >
                                    {number}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(lastPage)}
                                disabled={currentPage === lastPage}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                                <span className="sr-only">Last</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </nav>
                    </div>
                </div>
            </nav>
        );
    };

    const MobileSupplierCard = ({ supplier }) => (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-2">
                <div className="font-bold">Supplier Id:</div>
                <div>supplier-{supplier.id}</div>
                <div className="font-bold">Name:</div>
                <div>{supplier.name}</div>
                <div className="font-bold">Contact:</div>
                <div>{supplier.contact}</div>
                <div className="font-bold">Address:</div>
                <div>{supplier.address}</div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
                <button
                    onClick={() => openSuppliersEditModal(supplier)}
                    className="px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded hover:bg-blue-200"
                >
                    <FaEdit className="inline mr-1" /> Edit
                </button>
                <button
                    onClick={() => openSupplierItemsModal(supplier)}
                    className="px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded hover:bg-green-200"
                >
                    <FaEye className="inline mr-1" /> View Items
                </button>
                <button
                    onClick={() => openAddItemToSupplierModal(supplier)}
                    className="px-2 py-1 text-xs font-semibold text-yellow-600 bg-yellow-100 rounded hover:bg-yellow-200"
                >
                    <FaPlus className="inline mr-1" /> Add Item
                </button>
            </div>
        </div>
    );

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
                {isMobile ? (
                    <div className="p-4">
                        {currentSuppliers.map(supplier => (
                            <MobileSupplierCard key={supplier.id} supplier={supplier} />
                        ))}
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={suppliers.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={suppliers}
                        pagination
                        paginationPerPage={itemsPerPage}
                        paginationTotalRows={suppliers.length}
                        paginationComponentOptions={{
                            noRowsPerPage: true
                        }}
                        responsive
                        highlightOnHover
                        pointerOnHover
                        customStyles={customStyles}
                        noHeader
                    />
                )}
            </div>

            {isSuppliersCreateOpen && (
                <SuppliersCreate 
                    isOpen={isSuppliersCreateOpen} 
                    onClose={toggleSuppliersCreateModal} 
                    onSupplierCreated={fetchSuppliers} 
                />
            )}
            {isSuppliersEditOpen && (
                <SuppliersEdit 
                    isOpen={isSuppliersEditOpen} 
                    onClose={() => setIsSuppliersEditOpen(false)} 
                    supplier={selectedSupplier} 
                    onSupplierUpdated={fetchSuppliers} 
                />
            )}
            {isSupplierItemsOpen && (
                <SupplierItems 
                    isOpen={isSupplierItemsOpen} 
                    onClose={() => setIsSupplierItemsOpen(false)} 
                    supplier={selectedSupplier} 
                />
            )}
            {isAddItemToSupplierOpen && (
                <AddItemToSupplier 
                    isOpen={isAddItemToSupplierOpen} 
                    onClose={() => setIsAddItemToSupplierOpen(false)} 
                    supplier={selectedSupplier} 
                />
            )}
            {isEmployeesCreateOpen && (
                <EmployeesCreate 
                    isOpen={isEmployeesCreateOpen} 
                    onClose={toggleEmployeesCreateModal} 
                />
            )}
            {isReportFormOpen && (
                <SupplierReport 
                    onClose={toggleReportForm} 
                />
            )}
        </div>
    );
};

export default Suppliers;