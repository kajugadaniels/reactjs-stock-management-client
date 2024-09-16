import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { SearchIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/solid';

const StockOut = () => {
    const [stockOuts, setStockOuts] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const columns = [
        {
            name: 'Request ID',
            selector: row => row.requestId,
            sortable: true,
        },
        {
            name: 'Requester Name',
            selector: row => row.requesterName,
            sortable: true,
        },
        {
            name: 'Request From',
            selector: row => row.requestFrom,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
        },
        {
            name: 'Created At',
            selector: row => row.createdAt,
            sortable: true,
        },
    ];

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
                </div>
            </div>
        );
    }, [filterText]);

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
        </div>
    );
};

export default StockOut;