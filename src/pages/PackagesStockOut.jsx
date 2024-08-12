import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import PackageStockForm from './PackageStockForm';

const PackageStockOut = () => {
    const [packageProcesses, setPackageProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const fetchPackageProcesses = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/package-stock-outs`);
            setPackageProcesses(response.data);
            setLoading(false);
        } catch (error) {
            setError('Failed to fetch package processes');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackageProcesses();
    }, []);

    const mergedData = useMemo(() => {
        return packageProcesses.map(process => ({
            ...process,
            mergedItems: process.unmergedItems.reduce((acc, item) => {
                const existingItem = acc.find(i => i.item_id === item.item_id);
                if (existingItem) {
                    existingItem.quantity += item.quantity;
                } else {
                    acc.push({ ...item });
                }
                return acc;
            }, [])
        }));
    }, [packageProcesses]);

    const handleFinish = (row) => {
        setSelectedItem(row);
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setSelectedItem(null);
        fetchPackageProcesses();
    };

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Items',
            cell: row => (
                <div>
                    {row.mergedItems.map((item, index) => (
                        <div key={index}>
                            {item.item_name} - {item.quantity} {item.unit}
                            <br />
                            <small>
                                {item.category} | {item.type} | {item.capacity} {item.unit}
                            </small>
                        </div>
                    ))}
                </div>
            ),
            grow: 2,
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
            cell: row => (
                <span className={`px-2 py-1 rounded ${row.status === 'Pending' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>
                    {row.status}
                </span>
            ),
        },
        {
            name: 'Actions',
            cell: row => (
                <button
                    className={`px-4 py-2 text-white rounded ${row.status === 'Finished' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                    onClick={() => handleFinish(row)}
                    disabled={row.status === 'Finished'}
                >
                    {row.status === 'Finished' ? 'Already Finished' : 'Finish'}
                </button>
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

    if (loading) return <div className="mt-5 text-center">Loading...</div>;
    if (error) return <div className="mt-5 text-center text-red-500">{error}</div>;

    return (
        <div className="container py-32 mx-auto">
            <h1 className="mb-6 text-3xl font-semibold text-gray-800">Package Stock Out Dashboard</h1>
            <div className="mt-8 bg-white rounded-lg shadow">
                <DataTable
                    columns={columns}
                    data={mergedData}
                    pagination
                    responsive
                    highlightOnHover
                    pointerOnHover
                    customStyles={customStyles}
                />
            </div>
            <PackageStockForm
                isOpen={isFormOpen}
                onClose={handleFormClose}
                selectedItem={selectedItem}
            />
        </div>
    );
};

export default PackageStockOut;