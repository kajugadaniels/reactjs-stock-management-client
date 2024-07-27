import { useState, useEffect } from 'react';

export const useStockOut = () => {
    const [stockOuts, setStockOuts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAvailable, setIsAvailable] = useState(false);
    const [availableQuantities, setAvailableQuantities] = useState({});

    const fetchStockOuts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-outs`);
            if (!response.ok) {
                throw new Error('Failed to fetch stock outs');
            }
            const data = await response.json();
            setStockOuts(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const checkAvailability = async (items) => {
        setLoading(true);
        setError(null);
        try {
            const availability = {};
            for (const item of items) {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins/${item.item_id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch stock details');
                }
                const stockIn = await response.json();
                availability[item.item_id] = stockIn.quantity;
            }
            setAvailableQuantities(availability);
            const allAvailable = items.every(item => availability[item.item_id] >= item.pivot.quantity);
            setIsAvailable(allAvailable);
        } catch (error) {
            setError(error.message);
            setIsAvailable(false);
            setAvailableQuantities({});
        } finally {
            setLoading(false);
        }
    };

    const approveStockOut = async (requestId, items) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-outs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    request_id: requestId,
                    items,
                    date: new Date().toISOString().split('T')[0],
                    status: 'Pending',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Validation Error');
            }
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStockOuts();
    }, []);

    return {
        fetchStockOuts,
        checkAvailability,
        approveStockOut,
        stockOuts,
        loading,
        error,
        isAvailable,
        availableQuantities,
        setIsAvailable,
    };
};
