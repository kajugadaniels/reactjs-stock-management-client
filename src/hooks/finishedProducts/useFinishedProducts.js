import { useState } from 'react';

export const useFinishedProducts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addFinishedProduct = async (productData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/finished-products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add finished product');
            }

            const result = await response.json();

            // Update the stock out status to 'Approved'
            await fetch(`${import.meta.env.VITE_API_URL}/stock-outs/${productData.stock_out_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'Finished' }),
            });

            return result;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        addFinishedProduct,
        loading,
        error,
    };
};
