import { useState } from 'react';

const useRequestForm = () => {
    const [formData, setFormData] = useState({
        item_id: '',
        contact_id: '',
        requester: '',
        request_from: '',
        status: '',
        request_for: '',
        qty: '',
        note: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const addRequest = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Request Saved');
            }

            const newRequest = await response.json();
            return newRequest;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { formData, loading, handleChange, addRequest };
};

export default useRequestForm;
