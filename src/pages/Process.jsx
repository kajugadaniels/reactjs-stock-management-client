import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FinishedCreate from './Process/FinishedCreate';
import { useProcess } from '../hooks';

const Process = () => {
    const [isFinishedModalOpen, setIsFinishedModalOpen] = useState(false);
    const [selectedProcess, setSelectedProcess] = useState(null);
    const { processes, loading, error } = useProcess();
    const navigate = useNavigate();
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const toggleFinishedCreateModal = (process) => {
        setSelectedProcess(process);
        setIsFinishedModalOpen(!isFinishedModalOpen);
    };

    const handlePackagesStockOutClick = () => {
        navigate('/packages-stock-out');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProcesses = processes.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(processes.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen p-4 bg-gray-100 md:p-8 mt-20">
            <h1 className="mb-6 text-2xl font-semibold text-gray-800 md:text-3xl">Production Process and Finished Product</h1>
            <div className="grid grid-cols-1 gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
                
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-2 py-3 text-left text-gray-700 md:px-6">Check</th>
                            <th className="px-2 py-3 text-left text-gray-700 md:px-6">ID</th>
                            <th className="px-2 py-3 text-left text-gray-700 md:px-6">Item Name</th>
                            <th className="px-2 py-3 text-left text-gray-700 md:px-6">Stockout Item</th>
                            <th className="px-2 py-3 text-left text-gray-700 md:px-6">Category</th>
                            <th className="px-2 py-3 text-left text-gray-700 md:px-6">Total Quantity</th>
                            <th className="px-2 py-3 text-left text-gray-700 md:px-6">Status</th>
                            <th className="px-2 py-3 text-left text-gray-700 md:px-6">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentProcesses.map((process) => (
                            <tr key={process.id} className="transition duration-200 ease-in-out hover:bg-gray-100">
                                <td className="px-2 py-4 md:px-6">
                                    <input type="checkbox" className="w-4 h-4 text-blue-600 transition duration-150 ease-in-out form-checkbox" />
                                </td>
                                <td className="px-2 py-4 text-gray-700 md:px-6">{process.id}</td>
                                <td className="px-2 py-4 text-gray-700 md:px-6">
                                    {process.request.items.map(item => (
                                        <div key={item.id}>
                                            {item.item.name} - {item.item.type.name} - {item.pivot.quantity}
                                        </div>
                                    ))}
                                </td>
                                <td className="px-2 py-4 text-gray-700 md:px-6">{process.request.request_for.name}</td>
                                <td className="px-2 py-4 text-gray-700 md:px-6">{process.request.items[0]?.item.category.name}</td>
                                <td className="px-2 py-4 text-gray-700 md:px-6">
                                    {process.request.items.reduce((total, item) => total + item.pivot.quantity, 0)}
                                </td>
                                <td className="px-2 py-4 text-gray-700 md:px-6">
                                    <span className={`px-2 py-1 rounded ${process.status === 'Pending' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>
                                        {process.status}
                                    </span>
                                </td>
                                <td className="px-2 py-4 space-x-2 md:px-6">
                                    <button
                                        className={`px-4 py-2 text-white rounded ${process.status === 'Finished' ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                                        onClick={() => toggleFinishedCreateModal(process)}
                                        disabled={process.status === 'Finished'}
                                    >
                                        {process.status === 'Finished' ? 'Already Finished' : 'Finish'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center mt-4">
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => paginate(number)}
                        className={`px-4 py-2 mx-1 ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {number}
                    </button>
                ))}
            </div>

            <FinishedCreate isOpen={isFinishedModalOpen} onClose={() => setIsFinishedModalOpen(false)} process={selectedProcess} />
        </div>
    );
};

export default Process;
