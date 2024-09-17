import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { SearchIcon } from '@heroicons/react/solid';

const PackageStock = () => {
    const [packageStocks, setPackageStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [expandedRows, setExpandedRows] = useState({});

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
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

    const toggleRowExpansion = useCallback((row) => {
        setExpandedRows(prev => ({ ...prev, [row.id]: !prev[row.id] }));
    }, []);

    const columns = useMemo(() => [
        {
            name: '',
            width: '50px',
            cell: row => (
                <button onClick={() => toggleRowExpansion(row)}>
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
            name: 'Item Name',
            selector: row => row.item_name,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Category',
            selector: row => row.category,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Type',
            selector: row => row.type,
            sortable: true,
            minWidth: '150px',
        },
        {
            name: 'Capacity',
            selector: row => `${row.capacity} ${row.unit}`,
            sortable: true,
            minWidth: '150px',
            omit: isMobile,
        },
        {
            name: 'Quantity',
            selector: row => row.quantity,
            sortable: true,
            omit: isMobile,
            minWidth: '150px',
        },
    ], [isMobile, expandedRows, toggleRowExpansion]);

    const ExpandedRow = ({ data }) => (
        <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-2">
                <div className="font-bold">Capacity:</div>
                <div>{`${data.capacity} ${data.unit}`}</div>
                <div className="font-bold">Quantity:</div>
                <div>{data.quantity}</div>
            </div>
        </div>
    );

    const filteredItems = packageStocks.filter(
        item => item.item_name && item.item_name.toLowerCase().includes(filterText.toLowerCase()),
    );

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

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (error) return <div className="text-center mt-5 text-red-500">{error}</div>;

    return (
        <div className="container mx-auto py-32 px-4">
            <h1 className="text-2xl font-bold mb-4">Package Stock Inventory</h1>
            {subHeaderComponentMemo}
            <div className="mt-4">
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
                    expandableRows={isMobile}
                    expandableRowsComponent={ExpandedRow}
                    expandableRowExpanded={row => expandedRows[row.id]}
                    onRowExpandToggled={(expanded, row) => toggleRowExpansion(row)}
                />
            </div>
        </div>
    );
};

export default PackageStock;