import { useState } from 'react';

const useSupplierForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        address: '',
    });
    const [loading, setLoading] = useState(false);

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

    return {
        formData,
        loading,
        handleChange,
        addSupplier,
    };
};

export default useSupplierForm;
