import { useState, useEffect } from 'react';

const useFetchRequest = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRequests = async () => {
        try {
            const url = `${import.meta.env.VITE_API_URL}/requests`;
            console.log('Fetching from URL:', url);
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch requests: ${response.statusText}`);
            }
            const data = await response.json();
            setRequests(data);
        } catch (error) {
            console.error('Fetch requests error:', error);
            setError('Failed to fetch. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return { requests, loading, error, fetchRequests };
};

export default useFetchRequest;
