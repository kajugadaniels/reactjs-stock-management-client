import { useState, useEffect } from "react";

const useSupplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        address: '',
    });

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/suppliers`);
                if (!response.ok) {
                    throw new Error('Failed to fetch suppliers');
                }
                const data = await response.json();
                setSuppliers(data);
                setLoading(false);
            }
            catch (error) {
                console.error('Fetch suppliers error:', error);
                setError('Failed to fetch suppliers. Please try again later');
                setLoading(false);
            }
        };
        fetchSuppliers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const addSupplier = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/suppliers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to create supplier');
            }

            const data = await response.json();
            setLoading(false);
            return data; // Return the data object if needed
        } catch (error) {
            setLoading(false);
            console.error('Error creating supplier:', error);
            throw new Error(error.message || 'Failed to create supplier');
        }
    };

    const editSupplier = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/suppliers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to update supplier');
            }

            const data = await response.json();
            setLoading(false);
            return data;
        } catch (error) {
            setLoading(false);
            console.error('Error updating supplier:', error);
            throw new Error(error.message || 'Failed to update supplier');
        }
    };

    const deleteSupplier = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/suppliers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete supplier');
            }

            setLoading(false);
            return true;
        } catch (error) {
            setLoading(false);
            console.error('Error deleting supplier:', error);
            throw new Error(error.message || 'Failed to delete supplier');
        }
    };

    return {
        suppliers,
        loading,
        error,
        formData,
        setFormData,
        handleChange,
        addSupplier,
        editSupplier,
        deleteSupplier,
    };
};

export default useSupplier;
