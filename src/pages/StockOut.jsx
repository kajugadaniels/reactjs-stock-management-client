<<<<<<< HEAD
import React, { useState, useEffect, useMemo, useCallback } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> 53940b27f560fc985ca8898f66c06b7e4cacbc74
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { SearchIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/solid';

const StockOut = () => {
    const [stockOuts, setStockOuts] = useState([]);
    const [loading, setLoading] = useState(true);
<<<<<<< HEAD
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        status: '',
        requester: '',
    });
    const [expandedRows, setExpandedRows] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
=======
    const [filterText, setFilterText] = useState('');

    useEffect(() => {
        const fetchStockOuts = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/stock-outs');
                const formattedData = formatStockOutData(response.data);
                setStockOuts(formattedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stock outs:', error);
                setLoading(false);
            }
        };

        fetchStockOuts();
>>>>>>> 53940b27f560fc985ca8898f66c06b7e4cacbc74
    }, []);

    const formatStockOutData = (data) => {
        const groupedData = {};
        Object.values(data).forEach(group => {
            group.forEach(item => {
                if (!groupedData[item.request_id]) {
                    groupedData[item.request_id] = {
                        requestId: item.request_id,
                        requesterName: item.request.requester_name,
                        requestFrom: item.request.request_from,
                        status: item.request.status,
                        createdAt: new Date(item.created_at).toLocaleString(),
                        items: []
                    };
                }
                groupedData[item.request_id].items.push({
                    itemName: item.request.items[0].item.name,
                    itemType: item.request.items[0].item.type.name,
                    itemCategory: item.request.items[0].item.category.name,
                    capacity: item.request.items[0].item.capacity,
                    unit: item.request.items[0].item.unit,
                    quantity: item.quantity,
                    packageQty: item.package_qty,
                    approvedQuantity: item.approved_quantity,
                });
            });
        });
        return Object.values(groupedData);
    };

    const toggleRowExpansion = useCallback((row) => {
        setExpandedRows(prev => ({ ...prev, [row.id]: !prev[row.id] }));
    }, []);

    const columns = useMemo(() => [
        {
            name: '',
            width: '40px',
            cell: row => (
                <button onClick={() => toggleRowExpansion(row)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
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
                    </svg>
                </button>
            ),
            omit: !isMobile,
        },
        {
<<<<<<< HEAD
            name: 'Item',
            selector: (row) => row.request.items[0]?.item?.name || '',
            sortable: true,
            cell: (row) => (
                <div className="py-1">
                    {row.request.items.map((item, index) => (
                        <div key={index} className="mb-1">
                            <div className="font-semibold text-sm">{item.item?.name || ''} - {item.pivot.quantity}</div>
                            <div className="text-xs text-gray-600">
                                {item.item?.category?.name || 'N/A'} {item.item?.type?.name || 'N/A'}
                            </div>
                        </div>
                    ))}
                </div>
            ),
            width: '25%',
        },
        {
            name: 'Requester',
            selector: (row) => `${row.request.requester_name} / ${row.request.request_from}`,
=======
            name: 'Request ID',
            selector: row => row.requestId,
>>>>>>> 53940b27f560fc985ca8898f66c06b7e4cacbc74
            sortable: true,
            cell: (row) => (
                <div className="text-sm">
                    <div>{row.request.requester_name}</div>
                    <div className="text-xs text-gray-600">{row.request.request_from}</div>
                </div>
            ),
            width: '25%',
        },
        {
            name: 'Requester Name',
            selector: row => row.requesterName,
            sortable: true,
            omit: isMobile,
            width: '15%',
        },
        {
            name: 'Request From',
            selector: row => row.requestFrom,
            sortable: true,
            omit: isMobile,
            width: '15%',
        },
        {
            name: 'Status',
<<<<<<< HEAD
            cell: row => (
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                    {row.status}
                </span>
            ),
            width: '15%',
=======
            selector: row => row.status,
            sortable: true,
        },
        {
            name: 'Created At',
            selector: row => row.createdAt,
            sortable: true,
>>>>>>> 53940b27f560fc985ca8898f66c06b7e4cacbc74
        },
    ], [expandedRows, toggleRowExpansion, isMobile]);

    const ExpandedRow = ({ data }) => (
        <div className="p-4 bg-gray-50">
            <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-bold">Quantity:</div>
                <div>{data.request.items.reduce((total, item) => total + item.pivot.quantity, 0)}</div>
                <div className="font-bold">Date:</div>
                <div>{data.date}</div>
                {data.request.items.map((item, index) => (
                    <React.Fragment key={index}>
                        <div className="font-bold">Item {index + 1} Details:</div>
                        <div>
                            <div>{item.item?.name || ''} - {item.pivot.quantity}</div>
                            <div className="text-xs text-gray-600">
                                {item.item?.category?.name || 'N/A'} {item.item?.type?.name || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-600">
                                Supplier: {item.supplier?.name || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-600">
                                Package Qty: {data.package_qty || 'N/A'}
                            </div>
                        </div>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );

<<<<<<< HEAD
    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#f3f4f6',
                borderBottom: '2px solid #e5e7eb',
                minHeight: '40px',
            },
        },
        headCells: {
            style: {
                fontSize: '0.875rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                color: '#374151',
                paddingLeft: '8px',
                paddingRight: '8px',
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
                minHeight: '40px',
            },
        },
        cells: {
            style: {
                paddingLeft: '8px',
                paddingRight: '8px',
            },
        },
    };

    if (loading) return <div className="mt-5 text-center">Loading...</div>;
    if (error) return <div className="mt-5 text-center text-red-500">{error}</div>;

    return (
        <div className="container py-32 mx-auto px-4">
            <div className="flex flex-col mb-8 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <h1 className="text-3xl font-semibold text-gray-800">Stock Outs</h1>
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search stock outs..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                handleFilterChange({ target: { name: 'requester', value: e.target.value } });
                            }}
                            className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                        />
                        <SearchIcon className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                        />
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate}
                            onChange={handleFilterChange}
                            className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                        />
                    </div>
=======
    const ExpandedComponent = ({ data }) => {
        return (
            <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">Items:</h3>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity & Unit</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved Quantity</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Qty</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.items.map((item, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.itemCategory}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.itemType}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.capacity || ''} {item.unit || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.approvedQuantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.packageQty}</td>
                                </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const filteredItems = stockOuts.filter(
        item => item.requesterName && item.requesterName.toLowerCase().includes(filterText.toLowerCase())
    );

    const subHeaderComponentMemo = React.useMemo(() => {
        return (
            <div className="flex items-center justify-between p-4 bg-white">
                <div className="relative">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Filter by Requester Name"
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                    />
>>>>>>> 53940b27f560fc985ca8898f66c06b7e4cacbc74
                </div>
            </div>
        );
    }, [filterText]);

<<<<<<< HEAD
            <div className="mt-8 bg-white rounded-lg shadow">
                <DataTable
                    columns={columns}
                    data={stockOuts}
                    pagination
                    paginationServer
                    paginationTotalRows={totalItems}
                    onChangePage={(page) => setCurrentPage(page)}
                    onChangeRowsPerPage={(rowsPerPage) => setItemsPerPage(rowsPerPage)}
                    responsive
                    highlightOnHover
                    pointerOnHover
                    customStyles={customStyles}
                    expandableRows={isMobile}
                    expandableRowsComponent={ExpandedRow}
                    expandableRowExpanded={row => expandedRows[row.id]}
                    onRowExpandToggled={(expanded, row) => toggleRowExpansion(row)}
                    dense
                />
            </div>
=======
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">Stock Outs</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <DataTable
                    columns={columns}
                    data={filteredItems}
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 25, 50, 100]}
                    subHeader
                    subHeaderComponent={subHeaderComponentMemo}
                    persistTableHead
                    striped
                    highlightOnHover
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
                    expandableIcon={{
                        collapsed: <ChevronRightIcon className="h-5 w-5" />,
                        expanded: <ChevronDownIcon className="h-5 w-5" />
                    }}
                />
            )}
>>>>>>> 53940b27f560fc985ca8898f66c06b7e4cacbc74
        </div>
    );
};

export default StockOut;