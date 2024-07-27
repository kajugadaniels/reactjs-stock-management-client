import { useState, useEffect } from 'react';

export const useStockOut = () => {
    const [stockOuts, setStockOuts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAvailable, setIsAvailable] = useState(false);
    const [availableQuantities, setAvailableQuantities] = useState({}); // Updated state for available quantities

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
            const results = await Promise.all(
                items.map(async (item) => {
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins/${item.item_id}`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch stock details for item ID ${item.item_id}`);
                    }
                    const stockIn = await response.json();
                    return { item_id: item.item_id, available: stockIn.quantity >= item.pivot.quantity, availableQuantity: stockIn.quantity };
                })
            );

            const allAvailable = results.every(result => result.available);
            const quantities = results.reduce((acc, result) => {
                acc[result.item_id] = result.availableQuantity;
                return acc;
            }, {});

            setIsAvailable(allAvailable);
            setAvailableQuantities(quantities);
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
                    items: items.map(item => ({ item_id: item.item_id, quantity: item.pivot.quantity })),
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
        availableQuantities, // Updated to return available quantities
        setIsAvailable,
    };
};
