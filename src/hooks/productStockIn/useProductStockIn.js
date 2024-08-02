import { useState, useEffect, useCallback } from 'react';

export const useProductStockIn = () => {
    const [productStockIns, setProductStockIns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProductStockIns = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/product-stock-ins`);
            if (!response.ok) {
                throw new Error('Failed to fetch product stock ins');
            }
            const data = await response.json();
            setProductStockIns(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductStockIns();
    }, [fetchProductStockIns]);

    const addProductStockIn = async (productStockIn) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/product-stock-ins`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productStockIn)
            });

            if (!response.ok) {
                throw new Error('Failed to create product stock in');
            }

            const newProductStockIn = await response.json();
            setProductStockIns((prevStockIns) => [...prevStockIns, newProductStockIn]);
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    return {
        productStockIns,
        loading,
        error,
        fetchProductStockIns,
        addProductStockIn,
    };
};
