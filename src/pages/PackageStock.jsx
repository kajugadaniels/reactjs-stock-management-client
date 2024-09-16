import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { SearchIcon } from '@heroicons/react/solid';

const PackageStock = () => {
    const [packageStocks, setPackageStocks] = useState([]);
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
        fetchPackageStocks();
    }, []);

    const fetchPackageStocks = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/package-stocks`);
            setPackageStocks(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching package stocks:', error);
            setError('Failed to fetch package stocks data');
            setLoading(false);
        }
    };

    const columns = [
        {
            name: 'Item Name',
            selector: row => row.item_name,
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.category,
            sortable: true,
        },
        {
            name: 'Type',
            selector: row => row.type,
            sortable: true,
        },
        {
            name: 'Capacity',
            selector: row => `${row.capacity} ${row.unit}`,
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: row => row.quantity,
            sortable: true,
        },
    ];

    const filteredItems = packageStocks.filter(
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
            <div className="relative w-full md:w-64 mb-4">
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

    const MobilePackageStockCard = ({ item }) => (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-2">
                <div className="font-bold">Item Name:</div>
                <div>{item.item_name}</div>
                <div className="font-bold">Category:</div>
                <div>{item.category}</div>
                <div className="font-bold">Type:</div>
                <div>{item.type}</div>
                <div className="font-bold">Capacity:</div>
                <div>{`${item.capacity} ${item.unit}`}</div>
                <div className="font-bold">Quantity:</div>
                <div>{item.quantity}</div>
            </div>
        </div>
    );

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="text-center mt-5 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto py-32 px-4">
            <h1 className="text-2xl font-bold mb-4">Package Stock Inventory</h1>
            {subHeaderComponentMemo}
            <div className="mt-4">
                {isMobile ? (
                    <div>
                        {paginatedItems.map((item, index) => (
                            <MobilePackageStockCard key={index} item={item} />
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

export default PackageStock;