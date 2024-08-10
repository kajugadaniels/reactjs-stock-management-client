import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import CategoryCreate from './categories/CategoryCreate';
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
        },
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.category_name,
            sortable: true,
        },
        {
            name: 'Type',
            selector: row => row.type_name,
            sortable: true,
        },
        {
            name: 'Capacity',
            selector: row => `${row.capacity || 'N/A'} ${row.unit || ''}`,
            sortable: true,
        },
        {
            name: 'Action',
            cell: (row) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => openItemsEditModal(row)}
                        className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteItem(row.id)}
                        className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 rounded-full hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                    >
                        Delete
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
        <div className="container py-32 mx-auto">
            <div className="flex flex-col mb-8 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <h1 className="text-3xl font-semibold text-gray-800">Items Management</h1>
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search items..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                        />
                        
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

            <div className="mt-8 bg-white rounded-lg shadow">
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    responsive
                    highlightOnHover
                    pointerOnHover
                    customStyles={customStyles}
                />
            </div>

            {isItemsCreateOpen && <ItemsCreate isOpen={isItemsCreateOpen} onClose={toggleItemsCreateModal} onItemCreated={fetchItems} />}
            {isTypesCreateOpen && <TypesCreate isOpen={isTypesCreateOpen} onClose={toggleTypesCreateModal} />}
            {isItemsEditOpen && <ItemsEdit isOpen={isItemsEditOpen} onClose={closeItemsEditModal} item={selectedItem} onItemUpdated={fetchItems} />}
        </div>
    );
};

export default Items;