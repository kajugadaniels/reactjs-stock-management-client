import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { SearchIcon } from '@heroicons/react/solid';

const ProductionInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/production-inventory`);
            setInventory(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            setError('Failed to fetch inventory data');
            setLoading(false);
        }
    };

    const columns = [
        {
            name: 'Item Name',
            selector: row => row.item_name,
            sortable: true,
            wrap: true,
            minWidth: '300px',
        },
        {
            name: 'Package Type',
            selector: row => row.package_type,
            sortable: true,
            wrap: true,
            minWidth: '300px',
        },
        {
            name: 'Total Stock In (KG)',
            selector: row => row.total_stock_in,
            sortable: true,
            wrap: true,
            minWidth: '300px',
        },
        {
            name: 'Total Packages In',
            selector: row => row.total_packages_in,
            sortable: true,
            wrap: true,
            minWidth: '300px',
        },
        {
            name: 'Total Stock Out',
            selector: row => row.total_stock_out,
            sortable: true,
            wrap: true,
            minWidth: '300px',
        },
        {
            name: 'Available Quantity',
            wrap: true,
            minWidth: '300px',
            selector: row => row.available_quantity,
            sortable: true,
            cell: row => {
                const availableQuantity = row.total_stock_in - row.total_stock_out;
                return (
                    <span className={availableQuantity <= 0 ? 'text-red-600 font-semibold' : ''}>
                        {availableQuantity <= 0 ? 'Stock Out' : availableQuantity}
                    </span>
                );
            },
        },
    ];

    const filteredItems = inventory.filter(
        item => item.item_name && item.item_name.toLowerCase().includes(filterText.toLowerCase()),
    );

    const paginatedItems = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * itemsPerPage;
        const lastPageIndex = firstPageIndex + itemsPerPage;
        return filteredItems.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filteredItems, itemsPerPage]);

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const subHeaderComponentMemo = React.useMemo(() => {
        return (
            <div className="relative w-full md:w-64 mb-4 md:mb-0">
                <input
                    type="text"
                    placeholder="Filter by Item Name"
                    className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                />
                <SearchIcon className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
            </div>
        );
    }, [filterText]);

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

    const SimplePagination = ({ currentPage, totalPages, onPageChange }) => {
        return (
            <div className="flex justify-between items-center mt-4 px-4">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        );
    };

    const MobileInventoryCard = ({ item }) => (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-2">
                <div className="font-bold">Item Name:</div>
                <div>{item.item_name}</div>
                <div className="font-bold">Package Type:</div>
                <div>{item.package_type}</div>
                <div className="font-bold">Total Stock In (KG):</div>
                <div>{item.total_stock_in}</div>
                <div className="font-bold">Total Packages In:</div>
                <div>{item.total_packages_in}</div>
                <div className="font-bold">Total Stock Out:</div>
                <div>{item.total_stock_out}</div>
                <div className="font-bold">Available Quantity:</div>
                <div>
                    {item.total_stock_in - item.total_stock_out <= 0 ? (
                        <span className="text-red-600 font-semibold">Stock Out</span>
                    ) : (
                        item.total_stock_in - item.total_stock_out
                    )}
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="mt-5 text-center">Loading...</div>;
    if (error) return <div className="mt-5 text-center text-red-500">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-6 text-2xl font-bold">Production Inventory</h1>
            {subHeaderComponentMemo}
            <div className="mt-4">
                {isMobile ? (
                    <div>
                        {paginatedItems.map((item, index) => (
                            <MobileInventoryCard key={index} item={item} />
                        ))}
                        <SimplePagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
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
                        onChangePage={page => setCurrentPage(page)}
                        persistTableHead
                        customStyles={customStyles}
                    />
                )}
            </div>
        </div>
    );
};

export default ProductionInventory;