import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginLayout, UserLayout } from './layouts';
import { Dashboard, Login, Items, Suppliers, Stock, StockIn, Inventory, Process, ProductStockIn, ProductStockOut } from './pages';
import ProtectedRoute from './context/ProtectedRoute';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginLayout />}>
                    <Route index element={<Login />} />
                </Route>
                <Route path="/" element={<UserLayout />}>
                    <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="items" element={<ProtectedRoute><Items /></ProtectedRoute>} />
                    <Route path="suppliers" element={<ProtectedRoute><Suppliers /></ProtectedRoute>} />
                    <Route path="stock" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
                    <Route path="products" element={<ProtectedRoute><StockIn /></ProtectedRoute>} />
                    <Route path="inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                    <Route path="process" element={<ProtectedRoute><Process /></ProtectedRoute>} />
                    <Route path="product-stock-in" element={<ProtectedRoute><ProductStockIn /></ProtectedRoute>} />
                    <Route path="product-stock-out" element={<ProtectedRoute><ProductStockOut /></ProtectedRoute>} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;