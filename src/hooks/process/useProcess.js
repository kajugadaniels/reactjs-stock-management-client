import { useState, useEffect } from 'react';

const useProcess = () => {
    const [processes, setProcesses] = useState([]);
    const [packageProcesses, setPackageProcesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProcesses = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/process/stock-outs`);
            if (!response.ok) {
                throw new Error('Failed to fetch processes');
            }
            const data = await response.json();
            setProcesses(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchPackageProcesses = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/package-stock-outs`);
            if (!response.ok) {
                throw new Error('Failed to fetch package processes');
            }
            const data = await response.json();
            setPackageProcesses(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProcesses();
        fetchPackageProcesses();
    }, []);

    return { processes, packageProcesses, loading, error };
};

export default useProcess;
