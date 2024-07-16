import { useState, useEffect } from 'react';

const useFetchItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchItems = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/supplier-items`);
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data);
            setLoading(false);
        } catch (error) {
            console.error('Fetch items error:', error);
            setError('Failed to fetch items. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return { items, loading, error, fetchItems };
};

export default useFetchItems;
