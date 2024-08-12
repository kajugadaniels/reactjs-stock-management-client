import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';

const PackagesStockOut = () => {
    const [packageProcesses, setPackageProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const handleFinish = async (processId) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/package-stock-outs/${processId}`, { status: 'Finished' });
            Swal.fire('Success', 'Process marked as finished', 'success');
            fetchPackageProcesses();
        } catch (error) {
            Swal.fire('Error', 'Failed to update process status', 'error');
        }
    };

    const columns = [
        {
            name: 'ID',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Item Name',
            selector: row => row.item_name,
            sortable: true,
        },
        {
            name: 'Capacity',
            selector: row => row.capacity,
            sortable: true,
        },
        {
            name: 'Unit',
            selector: row => row.unit,
            sortable: true,
        },
        {
            name: 'Type',
            selector: row => row.type,
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.category,
            sortable: true,
        },
        {
            name: 'Total Quantity',
            selector: row => row.quantity,
            sortable: true,
        },
        {
            name: 'Status',
            cell: row => (
                <span className={`px-2 py-1 rounded ${row.status === 'Pending' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>
                    {row.status}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: row => (
                <button
                    className={`px-4 py-2 text-white rounded ${row.status === 'Finished' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                    onClick={() => handleFinish(row.id)}
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
            <h1 className="mb-6 text-3xl font-semibold text-gray-800">Packages Stock Out Dashboard</h1>
            <div className="mt-8 bg-white rounded-lg shadow">
                <DataTable
                    columns={columns}
                    data={packageProcesses.flatMap(process => 
                        process.unmergedItems.map(item => ({
                            id: process.id,
                            status: process.status,
                            ...item
                        }))
                    )}
                    pagination
                    responsive
                    highlightOnHover
                    pointerOnHover
                    customStyles={customStyles}
                />
            </div>
        </div>
    );
};

export default PackagesStockOut;