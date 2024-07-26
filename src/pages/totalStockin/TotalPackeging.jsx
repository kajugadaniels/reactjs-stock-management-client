import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import StockInCreate from '../../pages/stockIn/StockInCreate';
import StockInEdit from '../../pages/stockIn/StockInEdit';

// Helper function to aggregate stock items
const aggregateStockIns = (stockIns) => {
    const aggregated = {};

    stockIns.forEach(stockIn => {
        const key = `${stockIn.item.name}-${stockIn.item.category.name}-${stockIn.item.type.name}`;
        if (!aggregated[key]) {
            aggregated[key] = {
                id: stockIn.id, // Keep the last ID encountered for reference
                item: stockIn.item.name,
                category: stockIn.item.category.name,
                type: stockIn.item.type.name,
                quantity: 0 // Initialize quantity to 0 for aggregation
            };
        }
        aggregated[key].quantity += stockIn.quantity; // Sum the quantities
    });

    return Object.values(aggregated); // Convert the aggregated object back to an array for rendering
};

const StockIn = () => {
    const [stockIns, setStockIns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isStockInCreateOpen, setIsStockInCreateOpen] = useState(false);
    const [isStockInEditOpen, setIsStockInEditOpen] = useState(false);
    const [selectedStockIn, setSelectedStockIn] = useState(null);

    useEffect(() => {
        const fetchStockIns = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                let data = await response.json();
                data = data.filter(stockIn => stockIn.item.type.name.toLowerCase() === 'Sacks');
                setStockIns(aggregateStockIns(data)); 
            } catch (err) {
                setError(`Failed to fetch data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

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
                await fetch(`${import.meta.env.VITE_API_URL}/stock-ins/${id}`, {
                    method: 'DELETE'
                });
                Swal.fire('Deleted!', 'Stock in record has been deleted.', 'success').then(() => {
                    setStockIns(prevStockIns => prevStockIns.filter(stockIn => stockIn.id !== id));
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
            <div className='flex gap-10 p-4'>
                <Link to="/TotalRowMaterial">
                    <div className="p-10 text-center rounded-lg shadow-md bg-card">
                        <h2 className="text-muted-foreground">Total Raw Material</h2>
                        <p className="text-primary text-3xl text-[#00BDD6]">600 T</p>
                    </div>
                </Link>
                <Link to="/TotalPackeging">
                    <div className="p-10 text-center rounded-lg shadow-md bg-card">
                        <h2 className="text-muted-foreground">Total Packaging</h2>
                        <p className="text-primary text-3xl text-[#00BDD6]">600 T</p>
                    </div>
                </Link>
            </div>

           

            <div className="overflow-x-auto">
                <table className="w-full min-w-full bg-white rounded-lg shadow">
                    <thead>
                        <tr>
                            <th scope='col' className="px-6 py-3 border">ID</th>
                            <th scope='col' className="px-6 py-3 border">Item</th>
                            <th scope='col' className="px-6 py-3 border">Category</th>
                            <th scope='col' className="px-6 py-3 border">Type</th>
                            <th scope='col' className="px-6 py-3 border">RemainQty</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockIns.map((stockIn, index) => (
                            <tr className="border-t" key={index}>
                                <td className="px-4 py-4 border">{stockIn.id}</td>
                                <td className="px-4 py-4 border">{stockIn.item}</td>
                                <td className="px-4 py-4 border">{stockIn.category}</td>
                                <td className="px-4 py-4 border">{stockIn.type}</td>
                                <td className="px-4 py-4 border">{stockIn.quantity}</td>
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
