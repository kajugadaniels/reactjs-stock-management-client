import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { SearchIcon } from '@heroicons/react/solid';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';
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
    const [expandedRows, setExpandedRows] = useState({});

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

    const toggleRowExpansion = (id) => {
        setExpandedRows(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const columns = useMemo(() => [
        {
            name: 'Item Id',
            selector: row => `item-${row.id}`,
            sortable: true,
            omit: isMobile,
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Category',
            selector: row => row.category_name,
            sortable: true,
            omit: isMobile,
        },
        {
            name: 'Type',
            selector: row => row.type_name,
            sortable: true,
            wrap: true,
        },
        {
            name: 'Capacity',
            selector: row => `${row.capacity || 'N/A'} ${row.unit || ''}`,
            sortable: true,
            wrap: true,
            omit: isMobile,
        },
        {
            name: 'Action',
            cell: (row) => (
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                    <button
                        onClick={() => openItemsEditModal(row)}
                        className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 "
                    >
                        <span className="hidden sm:inline">Edit</span>
                        <FaEdit className="block sm:hidden" />
                    </button>
                    <button
                        onClick={() => handleDeleteItem(row.id)}
                        className="inline-flex items-center justify-center px-1 py-1 text-xs font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300 "
                    >
                        <span className="hidden sm:inline">Delete</span>
                        <FaTrash className="block sm:hidden" />
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            omit: isMobile,
        },
        {
            name: '',
            cell: (row) => (
                <button onClick={() => toggleRowExpansion(row.id)} className="text-gray-500 hover:text-gray-700">
                    {expandedRows[row.id] ? <FaChevronUp /> : <FaChevronDown />}
                </button>
            ),
            width: '50px',
            omit: !isMobile,
        },
    ], [isMobile, expandedRows]);

    const ExpandedRow = ({ data }) => (
        <div className="p-2 bg-gray-50">
            <p><strong>Item Id:</strong> item-{data.id}</p>
            <p><strong>Capacity:</strong> {`${data.capacity || 'N/A'} ${data.unit || ''}`}</p>
            <div className="mt-2 flex space-x-2">
                <button
                    onClick={() => openItemsEditModal(data)}
                    className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    Edit
                </button>
                <button
                    onClick={() => handleDeleteItem(data.id)}
                    className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
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
                textTransform: 'uppercase',
                color: '#374151',
                padding: '8px 4px',
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
                padding: '8px 4px',
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

    if (loading) return <div className="mt-5 text-center">Loading...</div>;
    if (error) return <div className="mt-5 text-center text-red-500">{error}</div>;

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

            <div className="mt-8 bg-white rounded shadow overflow-hidden">
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
                    expandableRows={isMobile}
                    expandableRowsComponent={ExpandedRow}
                    expandableRowExpanded={row => expandedRows[row.id]}
                    onRowExpandToggled={(expanded, row) => toggleRowExpansion(row.id)}
                />
            </div>

            {isItemsCreateOpen && <ItemsCreate isOpen={isItemsCreateOpen} onClose={toggleItemsCreateModal} onItemCreated={fetchItems} />}
            {isTypesCreateOpen && <TypesCreate isOpen={isTypesCreateOpen} onClose={toggleTypesCreateModal} />}
            {isItemsEditOpen && <ItemsEdit isOpen={isItemsEditOpen} onClose={closeItemsEditModal} item={selectedItem} onItemUpdated={fetchItems} />}
        </div>
    );
};

export default Items;