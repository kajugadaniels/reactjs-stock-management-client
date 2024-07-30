import { useState, useEffect } from 'react';

export const useProcess = () => {
    const [processes, setProcesses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProcesses = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/process/stock-outs`);
            if (!response.ok) {
                throw new Error('Failed to fetch processes');
            }
            const data = await response.json();
            // Filter processes to include only those with request_from as "Production"
            const filteredData = data.filter(process => process.request.request_from === 'Production');
            setProcesses(filteredData);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProcesses();
    }, []);

    return {
        processes,
        loading,
        error,
    };
};
