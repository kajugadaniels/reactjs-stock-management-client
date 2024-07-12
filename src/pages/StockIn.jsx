import React, { useState, useEffect } from 'react';
import StockInCreate from './stockIn/StockInCreate';
import StockInEdit from './stockIn/StockInEdit';
import Swal from 'sweetalert2';
import { useStockIn } from '../hooks';

const StockIn = () => {
    const { stockIns, loading, error, fetchStockIns, deleteStockIn } = useStockIn();
    const [isStockInCreateOpen, setIsStockInCreateOpen] = useState(false);
    const [isStockInEditOpen, setIsStockInEditOpen] = useState(false);
    const [selectedStockIn, setSelectedStockIn] = useState(null);

    useEffect(() => {
        fetchStockIns();
    }, []);

    const toggleStockInCreateModal = () => {
        setIsStockInCreateOpen(!isStockInCreateOpen);
        setIsStockInEditOpen(false);
    };

    const openStockInEditModal = (stockIn) => {
        setSelectedStockIn(stockIn);
        setIsStockInEditOpen(true);
        setIsStockInCreateOpen(false);
    };

    const closeStockInEditModal = () => {
        setIsStockInEditOpen(false);
        setSelectedStockIn(null);
    };

    const handleDeleteStockIn = async (id) => {
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this stock in record!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        });

        if (confirmed.isConfirmed) {
            try {
                await deleteStockIn(id);
                Swal.fire('Deleted!', 'Stock in record has been deleted.', 'success').then(() => {
                    fetchStockIns();
                });
            } catch (error) {
                Swal.fire('Error!', 'Failed to delete stock in record.', 'error');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-4">
                <div className="p-4 text-center bg-white rounded-lg shadow">
                    <h2 className="text-zinc-600">Total Stock Ins</h2>
                    <p className="text-3xl mt-2 text-[#00BDD6]">{stockIns.length}</p>
                </div>
            </div>
            <div className="flex flex-col gap-4 mb-4 sm:flex-row">
                <button className="bg-[#00BDD6] text-white px-4 py-2 rounded-md" onClick={toggleStockInCreateModal}>
                    Add Stock In
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-full bg-white rounded-lg shadow">
                    <thead>
                        <tr>
                            <th scope='col' className="px-6 py-3 border">ID</th>
                            <th scope='col' className="px-6 py-3 border">Item</th>
                            <th scope='col' className="px-6 py-3 border">Quantity</th>
                            <th scope='col' className="px-6 py-3 border">Registered By</th>
                            <th scope='col' className="px-6 py-3 border">Plaque</th>
                            <th scope='col' className="px-6 py-3 border">Batch</th>
                            <th scope='col' className="px-6 py-3 border">Status</th>
                            <th scope='col' className="px-6 py-3 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockIns.map((stockIn) => (
                            <tr className="border-t" key={stockIn.id}>
                                <td className="px-4 py-4 border">{stockIn.id}</td>
                                <td className="px-10 py-4 border">{stockIn.item.name}</td>
                                <td className="px-10 py-4 border">{stockIn.quantity}</td>
                                <td className="px-10 py-4 border">{stockIn.registered_by}</td>
                                <td className="px-10 py-4 border">{stockIn.plaque || 'N/A'}</td>
                                <td className="px-10 py-4 border">{stockIn.batch}</td>
                                <td className="px-10 py-4 border">{stockIn.status}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline ms-3"
                                        onClick={() => openStockInEditModal(stockIn)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5"/><path d="M14 2v4a2 2 0 0 0 2 2h4m-6.622 7.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/></g></svg>
                                    </button>
                                    <button
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline ms-3"
                                        onClick={() => handleDeleteStockIn(stockIn.id)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" fillRule="evenodd" d="m6.774 6.4l.812 13.648a.8.8 0 0 0 .798.752h7.232a.8.8 0 0 0 .798-.752L17.226 6.4zm11.655 0l-.817 13.719A2 2 0 0 1 15.616 22H8.384a2 2 0 0 1-1.996-1.881L5.571 6.4H3.5v-.7a.5.5 0 0 1 .5-.5h16a.5.5 0 0 1 .5.5v.7zM14 3a.5.5 0 0 1 .5.5v.7h-5v-.7A.5.5 0 0 1 10 3zM9.5 9h1.2l.5 9H10zm3.8 0h1.2l-.5 9h-1.2z"/></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isStockInCreateOpen && <StockInCreate isOpen={isStockInCreateOpen} onClose={toggleStockInCreateModal} />}
            {isStockInEditOpen && <StockInEdit isOpen={isStockInEditOpen} onClose={closeStockInEditModal} stockIn={selectedStockIn} />}
        </div>
    );
};

export default StockIn;