import { useState, useEffect } from 'react';

const useStockIn = () => {
    const [stockIns, setStockIns] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStockIns();
        fetchSuppliers();
        fetchCategories();
        fetchTypes();
    }, []);

    const fetchStockIns = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setStockIns(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/suppliers`);
            if (!response.ok) {
                throw new Error('Failed to fetch suppliers');
            }
            const data = await response.json();
            setSuppliers(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const data = await response.json();
            setCategories(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const fetchTypes = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/types`);
            if (!response.ok) {
                throw new Error('Failed to fetch types');
            }
            const data = await response.json();
            setTypes(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const deleteStockIn = async (id) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/stock-ins/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            throw new Error('Failed to delete stock in record');
        }
    };

    const getItemsBySupplier = async (supplierId) => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/supplier-items/supplier/${supplierId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch items for supplier');
            }
            const data = await response.json();
            setLoading(false);
            return data.data;
        } catch (error) {
            setError(error.message);
            setLoading(false);
            throw error;
        }
    };

    return {
        stockIns,
        suppliers,
        categories,
        types,
        loading,
        error,
        fetchStockIns,
        deleteStockIn,
        getItemsBySupplier,
    };
};

export default useStockIn;
