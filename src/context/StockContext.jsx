import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context for stock
const StockContext = createContext();

// Custom hook to use stock context
export const useStock = () => useContext(StockContext);

// StockProvider component to provide stock data and methods
export const StockProvider = ({ children }) => {
    const [stock, setStock] = useState({
        totalPackagingOut: [],
        stockOutRequests: [],
    });

    useEffect(() => {
        fetchStock();
    }, []);

    const fetchStock = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/stock-ins`);
            if (!response.ok) {
                throw new Error('Failed to fetch stock');
            }
            const data = await response.json();
            setStock(prev => ({
                ...prev,
                totalPackagingOut: data,
            }));
        } catch (error) {
            console.error('Error fetching stock:', error);
        }
    };

    const updateStock = (itemId, quantity) => {
        setStock(prev => ({
            ...prev,
            totalPackagingOut: prev.totalPackagingOut.map(item =>
                item.id === itemId ? { ...item, balance: item.balance - quantity } : item
            ),
        }));
    };

    const addStockOutRequest = (request) => {
        setStock(prev => ({
            ...prev,
            stockOutRequests: [...prev.stockOutRequests, request]
        }));
    };

    return (
        <StockContext.Provider value={{ stock, updateStock, addStockOutRequest }}>
            {children}
        </StockContext.Provider>
    );
};
