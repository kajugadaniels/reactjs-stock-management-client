import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useFetchRequest from '../../hooks/request/useFetchRequest'; // Assuming this hook exists and fetches request data

const TotalPackaging = () => {
    const { requests, loading: requestsLoading, error: requestsError } = useFetchRequest();
    const [stockIns, setStockIns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
                data = data.filter(stockIn => stockIn.item.name === 'Sacks'); // Filter items by name
                setStockIns(data); // Process data
            } catch (err) {
                setError(`Failed to fetch data: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        fetchStockIns();
    }, []);

    if (loading || requestsLoading) return <div>Loading...</div>;
    if (error || requestsError) return <div>Error: {error || requestsError}</div>;

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

            {/* Existing table for Overview of Sacks Remain in stock */}
            <h1>Overview of Sacks Remaining in Stock</h1>
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
                                <td className="px-4 py-4 border">{stockIn.item.name}</td>
                                <td className="px-4 py-4 border">{stockIn.item.category.name}</td>
                                <td className="px-4 py-4 border">{stockIn.item.type.name}</td>
                                <td className="px-4 py-4 border">{stockIn.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h1>Transactions of Stock Out</h1>
            <div className="overflow-x-auto">
                <table className="w-full min-w-full bg-white rounded-lg shadow">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 border">Req Id</th>
                            <th className="px-6 py-3 border">Item Name</th>
                            <th className="px-6 py-3 border">Category</th>
                            <th className="px-6 py-3 border">Type</th>
                            <th className="px-6 py-3 border">Quantity</th>
                            <th className="px-6 py-3 border">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map((request, index) => (
                            <tr key={index}>
                                <td className="px-4 py-4 border">{request.id}</td>
                                <td className="px-4 py-4 border">{request.item ? request.item.name : 'Unknown Item'}</td>
                                <td className="px-4 py-4 border">{request.item && request.item.category ? request.item.category.name : 'No Category'}</td>
                                <td className="px-4 py-4 border">{request.item && request.item.type ? request.item.type.name : 'No Type'}</td>
                                <td className="px-4 py-4 border">{request.qty}</td>
                                <td className="px-4 py-4 border">{request.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TotalPackaging;
