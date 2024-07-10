import { useState, useEffect } from 'react';

const useFetchStockIn = () => {
    const [stockIns, setStockIns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStockins = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/products`);
                if (!response.ok) {
                    throw new Error('Failed to fetch items');
                }
                const data = await response.json();
                setStockIns(data);
                setLoading(false);
            } catch (error) {
                console.error('Fetch stockins error:', error);
                setError('Failed to fetch stockins. Please try again later.');
                setLoading(false);
            }
        };

        fetchStockins();
    }, []);

    return { stockIns, loading, error };
};

export default useFetchStockIn;
