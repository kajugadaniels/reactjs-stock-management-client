import { useState, useEffect } from 'react';

export const useFinishedProducts = () => {
    const [finishedProducts, setFinishedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinishedProducts();
    }, []);

    const addFinishedProduct = async (finishedProduct) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/finished-products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(finishedProduct)
            });

            if (!response.ok) {
                throw new Error('Failed to create finished product');
            }

            fetchFinishedProducts(); // Refresh the list of finished products
        } catch (error) {
            setError(error.message);
            throw error; // Re-throw the error for further handling
        }
    };

    return {
        finishedProducts,
        loading,
        error,
        fetchFinishedProducts,
        addFinishedProduct
    };
};
