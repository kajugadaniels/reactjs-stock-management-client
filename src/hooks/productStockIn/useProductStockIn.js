import { useState, useEffect } from 'react';

export const useProductStockIn = () => {
    const [productStockIns, setProductStockIns] = useState([]);
    const [finishedProducts, setFinishedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProductStockIns = async () => {
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
    };

    const fetchFinishedProducts = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/finished-products`);
            if (!response.ok) {
                throw new Error('Failed to fetch finished products');
            }
            const data = await response.json();
            setFinishedProducts(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const fetchFinishedProductById = async (id) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/finished-products/${id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch finished product');
            }
            return await response.json();
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    useEffect(() => {
        fetchProductStockIns();
        fetchFinishedProducts();
    }, []);

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

            fetchProductStockIns(); // Refresh the list of product stock ins
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    return {
        productStockIns,
        finishedProducts,
        loading,
        error,
        fetchProductStockIns,
        fetchFinishedProductById,
        addProductStockIn
    };
};
