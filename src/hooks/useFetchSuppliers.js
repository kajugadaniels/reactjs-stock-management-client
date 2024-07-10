import { useState, useEffect } from "react";

const useFetchSuppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/suppliers`);
                if (!response.ok) {
                    throw new Error('failed to fetch suppliers');
                }
                const data = await response.json();
                setSuppliers(data);
                setLoading(false);
            }
            catch (error) {
                console.error('Fetch suppliers error:', error);
                setError('Failed to fetch suppliers. please try again later');
                setLoading(false);
            }
        };
        fetchSuppliers();
    }, []);
    return { suppliers, loading, error }; 
};

export default useFetchSuppliers;