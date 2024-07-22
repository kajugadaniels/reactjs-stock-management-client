import { useState, useEffect } from 'react';

export const useStockOut = () => {
    const [stockOuts, setStockOuts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isAvailable, setIsAvailable] = useState(false);

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

    const checkAvailability = async (itemId, quantity) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins/${itemId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch stock details');
            }
            const stockIn = await response.json();
            setIsAvailable(stockIn.quantity >= quantity);
        } catch (error) {
            setError(error.message);
            setIsAvailable(false);
        } finally {
            setLoading(false);
        }
    };

    const approveStockOut = async (requestId, quantity) => {
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
                    quantity,
                    date: new Date().toISOString().split('T')[0],
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
        setIsAvailable,
    };
};
