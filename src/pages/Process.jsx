import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import { SearchIcon } from '@heroicons/react/solid';
import FinishedCreate from './Process/FinishedCreate';

const Process = () => {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFinishedModalOpen, setIsFinishedModalOpen] = useState(false);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const fetchProcesses = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/process/stock-outs`);
            setProcesses(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching processes');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProcesses();
    }, []);

    const toggleFinishedCreateModal = (process) => {
        setSelectedProcess(process);
        setIsFinishedModalOpen(!isFinishedModalOpen);
    };

    const columns = [
        {
            name: 'Item Name',
            cell: row => (
                <div>
                    {row.request.items.map(item => (
                        <div key={item.id}>
                            {item.item.name} - {item.item.type.name} - {item.pivot.quantity}
                        </div>
                    ))}
                </div>
            ),
            sortable: true,
            grow: 2,
        },
        {
            name: 'Stockout Item',
            selector: row => row.request.request_for.name,
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.request.items[0]?.item.category.name,
            sortable: true,
        },
        {
            name: 'Total Quantity',
            selector: row => row.total_quantity,
            sortable: true,
        },
        {
            name: 'Status',
            cell: row => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === 'Pending' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {row.status}
                </span>
            ),
        },
        {
            name: 'Actions',
            cell: (row) => (
                <button
                    className={`px-6 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === 'Finished' ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'}`}
                    onClick={() => toggleFinishedCreateModal(row)}
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

    const filteredProcesses = useMemo(() => {
        return processes.filter(process =>
            process.request.items.some(item => 
                item.item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.item.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.item.type.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            process.request.request_for.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [processes, searchTerm]);

    if (loading) return <div className="mt-5 text-center">Loading...</div>;
    if (error) return <div className="mt-5 text-center text-red-500">{error}</div>;

    return (
        <div className="container py-32 mx-auto">
            <div className="flex flex-col mb-8 space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
                <h1 className="text-3xl font-semibold text-gray-800">Production Process and Finished Product</h1>
                <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search processes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                        />
                        <SearchIcon className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow">
                <DataTable
                    columns={columns}
                    data={filteredProcesses}
                    pagination
                    responsive
                    highlightOnHover
                    pointerOnHover
                    customStyles={customStyles}
                />
            </div>

            <FinishedCreate isOpen={isFinishedModalOpen} onClose={() => setIsFinishedModalOpen(false)} process={selectedProcess} />
        </div>
    );
};

export default Process;