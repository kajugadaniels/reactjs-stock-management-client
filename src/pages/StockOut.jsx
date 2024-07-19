import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useFetchRequest from '../hooks/request/useFetchRequest';

const Stock = () => {
    const { requests, loading, error, fetchRequests } = useFetchRequest();
    const [items, setItems] = useState([]);
    const [stockIns, setStockIns] = useState([]);
    const [requestStatus, setRequestStatus] = useState({});

    useEffect(() => {
        fetchRequests();
        fetchItems();
        fetchStockIns();
    }, []);

    useEffect(() => {
        if (requests && requests.length > 0) {
            const initialStatus = {};
            requests.forEach(request => {
                initialStatus[request.id] = { status: request.status, approved: false };
            });
            setRequestStatus(initialStatus);
        }
    }, [requests]);


   

    const fetchItems = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/items`);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    };

    const fetchStockIns = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins`);
            if (!response.ok) {
                throw new Error('Failed to fetch stock ins');
            }
            const data = await response.json();
            setStockIns(data);
        } catch (error) {
            console.error('Error fetching stock ins:', error);
        }
    };

    const getItemNameById = (id) => {
        const item = items.find(item => item.id === id);
        return item ? item.name : 'Unknown Item';
    };

    const handleApprove = async (id, itemId, qty) => {
        const item = items.find(item => item.id === itemId);

        if (!item) {
            Swal.fire('Error!', 'Item not found.', 'error');
            return;
        }

        const stockItem = stockIns.find(stock => stock.item.id === itemId);

        if (!stockItem || stockItem.quantity < qty) {
            Swal.fire({
                title: 'Error!',
                text: `Insufficient stock. Available quantity: ${stockItem ? stockItem.quantity : 0}`,
                icon: 'error'
            });
            return;
        }

        try {
            await fetch(`${import.meta.env.VITE_API_URL}/requests/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: 'Done' })
            });

            await fetch(`${import.meta.env.VITE_API_URL}/stock-ins/${stockItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ quantity: stockItem.quantity - qty })
            });

            setRequestStatus(prevStatus => ({
                ...prevStatus,
                [id]: { status: 'Done', approved: true }
            }));

            fetchStockIns(); 
        } catch (error) {
            Swal.fire('Error!', 'Failed to update request or stock.', 'error');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="p-6">
            <div className="flex space-x-4 mb-6">
                {/* Your link components or other header content here */}
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-zinc-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">Check</th>
                            <th className="px-4 py-2 border-b">Req Id</th>
                            <th className="px-4 py-2 border-b">Item</th>
                            <th className="px-4 py-2 border-b">Contact_id</th>
                            <th className="px-4 py-2 border-b">Requester</th>
                            <th className="px-4 py-2 border-b">Request_from</th>
                            <th className="px-4 py-2 border-b">Status</th>
                            <th className="px-4 py-2 border-b">Request_for</th>
                            <th className="px-4 py-2 border-b">Quantity</th>
                            <th className="px-4 py-2 border-b">Note</th>
                            <th className="px-4 py-2 border-b">Action</th> {/* Added Action column */}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(requests) && requests.length > 0 ? (
                            requests.sort((a, b) => a.id - b.id).map((request) => (
                                <tr key={request.id}>
                                    <td className="px-4 py-2 border-b"><input type="checkbox" /></td>
                                    <td className="px-4 py-2 border-b">{request.id}</td>
                                    <td className="px-4 py-2 border-b">{getItemNameById(request.item_id)}</td>
                                    <td className="px-4 py-2 border-b">{request.contact_id}</td>
                                    <td className="px-4 py-2 border-b">{request.requester}</td>
                                    <td className="px-4 py-2 border-b">{request.request_from}</td>
                                    <td className="px-4 py-2 border-b">{requestStatus[request.id]?.status || request.status}</td>
                                    <td className="px-4 py-2 border-b">{getItemNameById(request.item_id)}</td>
                                    <td className="px-4 py-2 border-b">{request.qty}</td>
                                    <td className="px-4 py-2 border-b">{request.note}</td>
                                    <td className="px-4 py-2 border-b">
                                        <button
                                            onClick={() => handleApprove(request.id, request.item_id, request.qty)}
                                            className={`bg-blue-500 text-white px-4 py-2 rounded ${requestStatus[request.id]?.approved ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={requestStatus[request.id]?.approved}
                                        >
                                            Approve
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="11" className="px-4 py-2 border-b">No requests found.</td> {/* Adjusted colspan to 11 */}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Stock;
