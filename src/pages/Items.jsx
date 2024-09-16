import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { SearchIcon } from '@heroicons/react/solid';
import { FaEdit, FaTrash } from 'react-icons/fa';
import ItemsCreate from './items/ItemsCreate';
import ItemsEdit from './items/ItemsEdit';
import TypesCreate from './types/TypesCreate';

const Items = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isItemsCreateOpen, setIsItemsCreateOpen] = useState(false);
    const [isTypesCreateOpen, setIsTypesCreateOpen] = useState(false);
    const [isItemsEditOpen, setIsItemsEditOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/items`);
            setItems(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching items');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const toggleItemsCreateModal = () => {
        setIsItemsCreateOpen(!isItemsCreateOpen);
        setIsItemsEditOpen(false);
        setIsTypesCreateOpen(false);
    };

    const toggleTypesCreateModal = () => {
        setIsTypesCreateOpen(!isTypesCreateOpen);
        setIsItemsCreateOpen(false);
        setIsItemsEditOpen(false);
    };

    const openItemsEditModal = (item) => {
        setSelectedItem(item);
        setIsItemsEditOpen(true);
        setIsItemsCreateOpen(false);
    };

    const closeItemsEditModal = () => {
        setIsItemsEditOpen(false);
        setSelectedItem(null);
    };

    const handleDeleteItem = async (id) => {
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
                await axios.delete(`${import.meta.env.VITE_API_URL}/items/${id}`);
                Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
                fetchItems();
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete the item.', 'error');
            }
        }
    };

    const columns = [
        {
            name: 'Item Id',
            selector: row => `item-${row.id}`,
            sortable: true,
            wrap: true,
            minWidth: '120px',
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            wrap: true,
            minWidth: '150px',
        },
        {
            name: 'Category',
            selector: row => row.category_name,
            sortable: true,
            wrap: true,
            minWidth: '150px',
        },
        {
            name: 'Type',
            selector: row => row.type_name,
            sortable: true,
            wrap: true,
            minWidth: '150px',
        },
        {
            name: 'Capacity',
            selector: row => `${row.capacity || 'N/A'} ${row.unit || ''}`,
            sortable: true,
            wrap: true,
            minWidth: '120px',
        },
        {
            name: 'Action',
            cell: (row) => (
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <button
                        onClick={() => openItemsEditModal(row)}
                        className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        <span className="hidden sm:inline">Edit</span>
                        <FaEdit className="block sm:hidden" />
                    </button>
                    <button
                        onClick={() => handleDeleteItem(row.id)}
                        className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                        <span className="hidden sm:inline">Delete</span>
                        <FaTrash className="block sm:hidden" />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            minWidth: '120px',
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
                whiteSpace: 'normal',
                wordBreak: 'break-word',
            },
        },
    };

    const filteredItems = useMemo(() => {
        return items.filter(item =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.type_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [items, searchTerm]);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) return <div className="mt-5 text-center">Loading...</div>;
    if (error) return <div className="mt-5 text-center text-red-500">{error}</div>;

    const MobileItemCard = ({ item }) => (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-2">
                <div className="font-bold">Item Id:</div>
                <div>item-{item.id}</div>
                <div className="font-bold">Name:</div>
                <div>{item.name}</div>
                <div className="font-bold">Category:</div>
                <div>{item.category_name}</div>
                <div className="font-bold">Type:</div>
                <div>{item.type_name}</div>
                <div className="font-bold">Capacity:</div>
                <div>{`${item.capacity || 'N/A'} ${item.unit || ''}`}</div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
                <button
                    onClick={() => openItemsEditModal(item)}
                    className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                    Delete
                </button>
            </div>
        </div>
    );

    const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
        const pageCount = Math.ceil(totalItems / itemsPerPage);
        const lastPage = pageCount;
        const pageRange = 5; // Number of page buttons to show

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
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                                <span className="sr-only">Previous</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {pageNumbers.map(number => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${currentPage === number
                                            ? 'z-10 bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                            : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                        }`}
                                >
                                    {number}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === lastPage}
                                className="relative inline-flex items-center px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                            >
                                <span className="sr-only">Next</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                                </svg>
                            </button>
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

    return (
        <div className="container py-8 mx-auto px-4 mt-20">
            <div className="flex flex-col mb-8 space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <h1 className="text-3xl font-semibold text-gray-800">Items Management</h1>
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                        />
                        <SearchIcon className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
                    </div>
                    <button
                        onClick={toggleItemsCreateModal}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#00BDD6] rounded-md hover:bg-[#00a8c2] focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:ring-offset-2"
                    >
                        Add Item
                    </button>
                    <button
                        onClick={toggleTypesCreateModal}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#00BDD6] rounded-md hover:bg-[#00a8c2] focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:ring-offset-2"
                    >
                        Add Types
                    </button>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
                {isMobile ? (
                    <div className="p-4">
                        {currentItems.map(item => (
                            <MobileItemCard key={item.id} item={item} />
                        ))}
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredItems.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </div>
                ) : (
                    <DataTable
                        columns={columns}
                        data={filteredItems}
                        pagination
                        paginationPerPage={itemsPerPage}
                        paginationTotalRows={filteredItems.length}
                        paginationComponentOptions={{
                            noRowsPerPage: true
                        }}
                        responsive
                        highlightOnHover
                        pointerOnHover
                        customStyles={customStyles}
                        defaultSortFieldId={1}
                        defaultSortAsc={true}
                    />
                )}
            </div>

            {isItemsCreateOpen && <ItemsCreate isOpen={isItemsCreateOpen} onClose={toggleItemsCreateModal} onItemCreated={fetchItems} />}
            {isTypesCreateOpen && <TypesCreate isOpen={isTypesCreateOpen} onClose={toggleTypesCreateModal} />}
            {isItemsEditOpen && <ItemsEdit isOpen={isItemsEditOpen} onClose={closeItemsEditModal} item={selectedItem} onItemUpdated={fetchItems} />}
        </div>
    );
};

export default Items;