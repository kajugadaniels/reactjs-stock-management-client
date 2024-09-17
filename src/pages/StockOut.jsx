import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { SearchIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/solid';

const StockOut = () => {
    const [stockOuts, setStockOuts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterText, setFilterText] = useState('');
    const [expandedRows, setExpandedRows] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const fetchStockOuts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/stock-outs`);
                const formattedData = formatStockOutData(response.data);
                setStockOuts(formattedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching stock outs:', error);
                setLoading(false);
            }
        };

        fetchStockOuts();
    }, []);

    const formatStockOutData = (data) => {
        const groupedData = {};
        Object.values(data).forEach(group => {
            group.forEach(item => {
                if (!groupedData[item.request_id]) {
                    groupedData[item.request_id] = {
                        id: item.request_id,
                        requestId: item.request_id,
                        requesterName: item.request.requester_name,
                        requestFrom: item.request.request_from,
                        status: item.request.status,
                        createdAt: new Date(item.created_at).toLocaleString(),
                        items: [] // Initialize items array for the request
                    };
                }
                // Find the correct request item related to the stock_out entry
                const stockOutItem = item.request.items.find(i => i.id === item.request_item_id); // Assuming you have request_item_id
                
                if (stockOutItem) {
                    groupedData[item.request_id].items.push({
                        itemName: stockOutItem.item.name,
                        itemType: stockOutItem.item.type.name,
                        itemCategory: stockOutItem.item.category.name,
                        capacity: stockOutItem.item.capacity,
                        unit: stockOutItem.item.unit,
                        quantity: item.quantity, 
                        packageQty: item.package_qty,
                        approvedQuantity: item.approved_quantity,
                    });
                }
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
            name: 'Request ID',
            selector: row => row.requestId,
            sortable: true,
            width: '15%',
        },
        {
            name: 'Requester Name',
            selector: row => row.requesterName,
            sortable: true,
            width: '20%',
        },
        {
            name: 'Request From',
            selector: row => row.requestFrom,
            sortable: true,
            width: '20%',
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            width: '15%',
        },
        {
            name: 'Created At',
            selector: row => row.createdAt,
            sortable: true,
            width: '20%',
        },
    ], [expandedRows, toggleRowExpansion, isMobile]);

    const ExpandedComponent = ({ data }) => {
        return (
            <div className="p-4">
                <h3 className="mb-2 text-lg font-semibold">Items:</h3>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Item Name</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Category</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Capacity & Unit</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Quantity</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Approved Quantity</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Package Qty</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.items.map((item, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">{item.itemName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.itemCategory}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.itemType}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.capacity || ''} {item.unit || 'N/A'}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
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
                    <SearchIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <input
                        type="text"
                        className="py-2 pl-10 pr-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Filter by Requester Name"
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                    />
                </div>
            </div>
        );
    }, [filterText]);

    return (
        <div className="container px-4 py-8 mx-auto">
            <h1 className="mb-4 text-2xl font-bold">Stock Outs</h1>
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
                        collapsed: <ChevronRightIcon className="w-5 h-5" />,
                        expanded: <ChevronDownIcon className="w-5 h-5" />
                    }}
                />
            )}
        </div>
    );
};

export default StockOut;