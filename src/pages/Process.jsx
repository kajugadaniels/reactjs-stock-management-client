import React, { useState } from 'react';
import FinishedCreate from './Process/FinishedCreate';
import PackegingCreate from './Process/PackegingCreate';
import { useProcess } from '../hooks';

const Process = () => {
    const [isFinishedModalOpen, setIsFinishedModalOpen] = useState(false);
    const [isPackegingModalOpen, setIsPackegingModalOpen] = useState(false);
    const { processes, loading, error } = useProcess();

    const toggleFinishedCreateModal = () => {
        setIsFinishedModalOpen(!isFinishedModalOpen);
    };

    const togglePackegingCreateModal = () => {
        setIsPackegingModalOpen(!isPackegingModalOpen);
    };

    const handleApprove = () => {
        setStatus('Approved');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="min-h-screen p-8 bg-gray-100">
            <h1 className="mb-6 text-3xl font-semibold text-gray-800">Production Process, Finished Product, and Packaging</h1>
            <div className="grid grid-cols-4 gap-6 mb-8">
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-gray-500">Total Requested</h2>
                    <p className="mt-4 text-3xl font-bold text-[#00BDD6]">600 T</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-gray-500">Total Pending</h2>
                    <p className="mt-4 text-3xl font-bold text-[#00BDD6]">500 T</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-gray-500">Total Complete</h2>
                    <p className="mt-4 text-3xl font-bold text-[#00BDD6]">5</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="text-gray-500">Total Remaining</h2>
                    <p className="mt-4 text-3xl font-bold text-[#00BDD6]">2</p>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-gray-700">Check</th>
                            <th className="px-6 py-3 text-left text-gray-700">Item Name</th>
                            <th className="px-6 py-3 text-left text-gray-700">Stockout Item</th>
                            <th className="px-6 py-3 text-left text-gray-700">Category</th>
                            <th className="px-6 py-3 text-left text-gray-700">Type</th>
                            <th className="px-6 py-3 text-left text-gray-700">Quantity</th>
                            <th className="px-6 py-3 text-left text-gray-700">Status</th>
                            <th className="px-6 py-3 text-left text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {processes.map((process) => (
                            <tr key={process.id} className="transition duration-200 ease-in-out hover:bg-gray-100">
                                <td className="px-6 py-4">
                                    <input type="checkbox" className="w-4 h-4 text-blue-600 transition duration-150 ease-in-out form-checkbox" />
                                </td>
                                <td className="px-6 py-4 text-gray-700">{process.request.item?.item?.name}</td>
                                <td className="px-6 py-4 text-gray-700">{process.request.request_for.name}</td>
                                <td className="px-6 py-4 text-gray-700">{process.request.item?.item?.category?.name}</td>
                                <td className="px-6 py-4 text-gray-700">{process.request.item?.item?.type?.name}</td>
                                <td className="px-6 py-4 text-gray-700">{process.quantity}</td>
                                <td className="px-6 py-4 text-gray-700">{process.request.status}</td>
                                <td className="px-6 py-4 space-x-2">
                                    <button className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600" onClick={handleApprove}>
                                        Approve
                                    </button>
                                    <button className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600" onClick={toggleFinishedCreateModal}>
                                        Finished
                                    </button>
                                    <button className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" onClick={togglePackegingCreateModal}>
                                        Packaging
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <FinishedCreate isOpen={isFinishedModalOpen} onClose={toggleFinishedCreateModal} />
            <PackegingCreate isOpen={isPackegingModalOpen} onClose={togglePackegingCreateModal} />
        </div>
    );
};

export default Process;
