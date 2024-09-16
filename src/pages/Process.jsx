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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const handleFinishedCreated = () => {
        setProcesses(prevProcesses =>
            prevProcesses.map(proc =>
                proc.id === selectedProcess.id ? { ...proc, status: 'Finished' } : proc
            )
        );
        setIsFinishedModalOpen(false);
    };

    const columns = [
        {
            name: 'Item Name',
            wrap: true,
            minWidth: '300px',
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
            wrap: true,
            minWidth: '300px',
        },
        {
            name: 'Category',
            selector: row => row.request.items[0]?.item.category.name,
            sortable: true,
            wrap: true,
            minWidth: '300px',
        },
        {
            name: 'Total Quantity',
            selector: row => row.total_quantity,
            sortable: true,
            wrap: true,
            minWidth: '300px',
        },
        {
            name: 'Status',
            wrap: true,
            minWidth: '150px',
            cell: row => (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === 'Pending' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {row.status}
                </span>
            ),
        },
        {
            name: 'Actions',
            wrap: true,
            minWidth: '200px',
            cell: (row) => (
                <button
                    className={`px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-md ${row.status === 'Finished' ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'} w-full sm:w-auto`}
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

    const paginatedProcesses = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * itemsPerPage;
        const lastPageIndex = firstPageIndex + itemsPerPage;
        return filteredProcesses.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filteredProcesses, itemsPerPage]);

    const totalPages = Math.ceil(filteredProcesses.length / itemsPerPage);

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

    const MobileProcessCard = ({ process }) => (
        <div className="bg-white shadow rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-2">
                <div className="font-bold">Item Name:</div>
                <div>
                    {process.request.items.map(item => (
                        <div key={item.id}>
                            {item.item.name} - {item.item.type.name} - {item.pivot.quantity}
                        </div>
                    ))}
                </div>
                <div className="font-bold">Stockout Item:</div>
                <div>{process.request.request_for.name}</div>
                <div className="font-bold">Category:</div>
                <div>{process.request.items[0]?.item.category.name}</div>
                <div className="font-bold">Total Quantity:</div>
                <div>{process.total_quantity}</div>
                <div className="font-bold">Status:</div>
                <div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${process.status === 'Pending' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {process.status}
                    </span>
                </div>
            </div>
            <div className="mt-4">
                <button
                    className={`px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-md ${process.status === 'Finished' ? 'bg-green-100 text-green-800' : 'bg-green-100 text-green-800'} w-full`}
                    onClick={() => toggleFinishedCreateModal(process)}
                    disabled={process.status === 'Finished'}
                >
                    {process.status === 'Finished' ? 'Already Finished' : 'Finish'}
                </button>
            </div>
        </div>
    );

    if (loading) return <div className="mt-5 text-center">Loading...</div>;
    if (error) return <div className="mt-5 text-center text-red-500">{error}</div>;

    return (
        <div className="container py-32 mx-auto px-4">
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
                {isMobile ? (
                    <div className="p-4">
                        {paginatedProcesses.map(process => (
                            <MobileProcessCard key={process.id} process={process} />
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
                        data={filteredProcesses}
                        pagination
                        paginationPerPage={itemsPerPage}
                        paginationTotalRows={filteredProcesses.length}
                        paginationComponentOptions={{
                            noRowsPerPage: true
                        }}
                        onChangePage={page => setCurrentPage(page)}
                        responsive
                        highlightOnHover
                        pointerOnHover
                        customStyles={customStyles}
                    />
                )}
            </div>

            <FinishedCreate
                isOpen={isFinishedModalOpen}
                onClose={() => setIsFinishedModalOpen(false)}
                process={selectedProcess}
                onFinishedCreated={handleFinishedCreated}
            />
        </div>
    );
};

export default Process;