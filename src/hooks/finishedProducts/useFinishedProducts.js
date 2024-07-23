import { useState, useEffect } from 'react';

const useFinishedProducts = () => {
    const [finishedProducts, setFinishedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        fetchFinishedProducts();
    }, []);

    return { finishedProducts, loading, error };
};

export default useFinishedProducts;
