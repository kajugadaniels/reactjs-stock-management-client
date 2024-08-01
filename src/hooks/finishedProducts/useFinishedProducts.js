import { useState, useEffect } from 'react';

export const useFinishedProducts = () => {
    const [finishedProducts, setFinishedProducts] = useState([]);
    const [stockIns, setStockIns] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFinishedProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/finished-products`);
            if (!response.ok) {
                throw new Error('Failed to fetch finished products');
            }
            const data = await response.json();
            setFinishedProducts(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStockIns = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/package-items`);
            if (!response.ok) {
                throw new Error('Failed to fetch stock ins');
            }
            const data = await response.json();
            setStockIns(data);
        } catch (error) {
            setError(error.message);
        }
    };

    const addFinishedProduct = async (productData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/finished-products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add finished product');
            }

            const result = await response.json();

            // Update the stock out status to 'Finished'
            await fetch(`${import.meta.env.VITE_API_URL}/stock-outs/${productData.stock_out_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'Finished' }),
            });

            // Re-fetch finished products to update the state
            fetchFinishedProducts();

            return result;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const addPackagingRequest = async (finishedProductId, packageRequests) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/package-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ finished_product_id: finishedProductId, packages: packageRequests }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add packaging request');
            }

            const result = await response.json();
            fetchFinishedProducts();

            return result;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinishedProducts();
        fetchStockIns();
    }, []);

    return {
        finishedProducts,
        stockIns,
        loading,
        error,
        addFinishedProduct,
        addPackagingRequest,
    };
};
