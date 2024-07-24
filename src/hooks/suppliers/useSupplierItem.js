import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const useSupplierItem = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    const fetchAvailableItems = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/available-items`);
            if (!response.ok) {
                throw new Error('Failed to fetch available items');
            }
            const data = await response.json();
            setItems(data.data || []);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const addItemToSupplier = async (supplierId, itemId, onSuccess, onError) => {
        setIsAdding(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/supplier-items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    supplier_id: supplierId,
                    item_id: itemId,
                }),
            });

            if (response.ok) {
                Swal.fire('Success', 'Item added to supplier successfully.', 'success');
                onSuccess();
            } else {
                const errorData = await response.json();
                if (response.status === 400 && errorData.message === 'This supplier already supplies this item') {
                    Swal.fire('Error', 'This supplier already supplies this item.', 'error');
                } else {
                    Swal.fire('Error', 'Failed to add item to supplier.', 'error');
                }
                onError();
            }
        } catch (error) {
            Swal.fire('Error', 'An error occurred while adding the item.', 'error');
            onError();
        } finally {
            setIsAdding(false);
        }
    };

    const fetchSupplierItems = async (supplierId) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/supplier-items/supplier/${supplierId}`);
            if (response.status === 404) {
                setError('No items found for this supplier');
                setLoading(false);
                return [];
            }
            if (!response.ok) {
                throw new Error('Failed to fetch supplier items');
            }
            const data = await response.json();
            const filteredItems = data.data.filter(item => item.category_name !== 'Finished');
            setItems(filteredItems);
            return filteredItems;
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return {
        items,
        loading,
        error,
        isAdding,
        fetchAvailableItems,
        addItemToSupplier,
        fetchSupplierItems,
    };
};

export default useSupplierItem;
