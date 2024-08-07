import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useStockIn } from '../hooks';
import StockInCreate from './stockIn/StockInCreate';
import StockInDetails from './stockIn/StockInDetails';
import StockInEdit from './stockIn/StockInEdit';
import StockInReport from './reports/StockInReport';

const StockIn = () => {
    const { stockIns, loading, error, fetchStockIns, deleteStockIn, categories, types } = useStockIn();
    const [isStockInCreateOpen, setIsStockInCreateOpen] = useState(false);
    const [isStockInEditOpen, setIsStockInEditOpen] = useState(false);
    const [isStockInDetailsOpen, setIsStockInDetailsOpen] = useState(false);
    const [isStockInReportOpen, setIsStockInReportOpen] = useState(false);
    const [selectedStockIn, setSelectedStockIn] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        type: '',
        startDate: '',
        endDate: '',
        loading_payment_status: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchStockIns(filters);
    }, [filters]);

    const toggleStockInCreateModal = () => {
        setIsStockInCreateOpen(!isStockInCreateOpen);
        setIsStockInEditOpen(false);
        setIsStockInDetailsOpen(false);
        setIsStockInReportOpen(false);
    };

    const openStockInEditModal = (stockIn) => {
        setSelectedStockIn(stockIn);
        setIsStockInEditOpen(true);
        setIsStockInCreateOpen(false);
        setIsStockInDetailsOpen(false);
        setIsStockInReportOpen(false);
    };

    const openStockInDetailsModal = (stockInId) => {
        setSelectedStockIn(stockInId);
        setIsStockInDetailsOpen(true);
        setIsStockInEditOpen(false);
        setIsStockInCreateOpen(false);
        setIsStockInReportOpen(false);
    };

    const openStockInReportModal = () => {
        setIsStockInReportOpen(true);
        setIsStockInCreateOpen(false);
        setIsStockInEditOpen(false);
        setIsStockInDetailsOpen(false);
    };

    const closeStockInEditModal = () => {
        setIsStockInEditOpen(false);
        setSelectedStockIn(null);
    };

    const closeStockInDetailsModal = () => {
        setIsStockInDetailsOpen(false);
        setSelectedStockIn(null);
    };

    const closeStockInReportModal = () => {
        setIsStockInReportOpen(false);
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
                const response = await deleteStockIn(id);
                if (response.status === 204) {
                    Swal.fire('Deleted!', 'Stock in record has been deleted.', 'success').then(() => {
                        fetchStockIns(filters);
                    });
                } else {
                    throw new Error('Unexpected status code received.');
                }
            } catch (error) {
                let errorMessage = 'Failed to delete stock in record.';
                if (error.response && error.response.status === 400) {
                    errorMessage = error.response.data.message;
                } else if (error.message) {
                    errorMessage = error.message;
                }
                Swal.fire('Stop!', 'You cannot delete the record because it is used in request.', 'error');
            }
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value
        }));
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStockIns = stockIns.slice(indexOfFirstItem, indexOfLastItem);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(stockIns.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="p-4">
            <div className='flex flex-col gap-4 sm:flex-row sm:gap-10 p-4'>
                
            </div>

            <div className="flex flex-col gap-4 mb-4 sm:flex-row">
                <button className="bg-[#00BDD6] text-white px-4 py-2 rounded-md" onClick={toggleStockInCreateModal}>
                    Add Stock In
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded-md" onClick={openStockInReportModal}>
                    Generate Report
                </button>
            </div>

            <div className="flex flex-col gap-4 mb-4 sm:flex-row sm:flex-wrap">
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                    <select
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className="p-2 border border-gray-300 rounded w-full sm:w-52"
                    >
                        <option value="">All Categories</option>
                        {categories
                            .filter((category) => category.name !== 'Finished')
                            .map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
                    <select
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        className="p-2 border border-gray-300 rounded w-full sm:w-52"
                    >
                        <option value="">All Types</option>
                        {types.map((type) => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        value={filters.startDate}
                        onChange={handleFilterChange}
                        className="p-2 border border-gray-300 rounded w-full sm:w-52"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        value={filters.endDate}
                        onChange={handleFilterChange}
                        className="p-2 border border-gray-300 rounded w-full sm:w-52"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Payment Status</label>
                    <select
                        name="loading_payment_status"
                        value={filters.loading_payment_status}
                        onChange={handleFilterChange}
                        className="p-2 border border-gray-300 rounded w-full sm:w-52"
                    >
                        <option value="">All</option>
                        <option value="true">Paid</option>
                        <option value="false">Not Paid</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error}</div>
            ) : stockIns.length === 0 ? (
                <div className="text-center text-gray-500">No data found for the selected filters.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-full bg-white rounded-lg shadow">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="py-2 px-4">No</th>
                                <th className="py-2 px-4">Date</th>
                                <th className="py-2 px-4">Supplier</th>
                                <th className="py-2 px-4">Item</th>
                                <th className="py-2 px-4">Category</th>
                                <th className="py-2 px-4">Type</th>
                                <th className="py-2 px-4">Quantity</th>
                                <th className="py-2 px-4">Plate Number</th>
                                <th className="py-2 px-4">Batch Number</th>
                                <th className="py-2 px-4">Payment Status</th>
                                <th className="py-2 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentStockIns.map((stockIn, index) => (
                                <tr key={stockIn.id} className="text-gray-700">
                                    <td className="py-2 px-4">{indexOfFirstItem + index + 1}</td>
                                    <td className="py-2 px-4">{stockIn.date}</td>
                                    <td className="py-2 px-4">{stockIn.supplier.name}</td>
                                    <td className="py-2 px-4">{stockIn.item.name}</td>
                                    <td className="py-2 px-4">{stockIn.item.category.name}</td>
                                    <td className="py-2 px-4">{stockIn.item.type.name}</td>
                                    <td className="py-2 px-4">{stockIn.quantity}</td>
                                    <td className="py-2 px-4">{stockIn.plate_number}</td>
                                    <td className="py-2 px-4">{stockIn.batch_number}</td>
                                    <td className="py-2 px-4">{stockIn.loading_payment_status ? 'Paid' : 'Not Paid'}</td>
                                    <td className="py-2 px-4 flex gap-2">
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                                            onClick={() => openStockInDetailsModal(stockIn.id)}
                                        >
                                            Details
                                        </button>
                                        <button
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-md"
                                            onClick={() => openStockInEditModal(stockIn)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                                            onClick={() => handleDeleteStockIn(stockIn.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
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
                </div>
            )}

            {isStockInCreateOpen && (
                <StockInCreate isOpen={isStockInCreateOpen} onClose={toggleStockInCreateModal} />
            )}

            {isStockInEditOpen && (
                <StockInEdit isOpen={isStockInEditOpen} onClose={closeStockInEditModal} stockIn={selectedStockIn} />
            )}

            {isStockInDetailsOpen && (
                <StockInDetails isOpen={isStockInDetailsOpen} onClose={closeStockInDetailsModal} stockInId={selectedStockIn} />
            )}

            {isStockInReportOpen && (
                <StockInReport isOpen={isStockInReportOpen} onClose={closeStockInReportModal} />
            )}
        </div>
    );
};

export default StockIn;