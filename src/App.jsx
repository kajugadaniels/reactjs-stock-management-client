import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginLayout, UserLayout } from './layouts';
import { Dashboard, Login, Items, Suppliers, Stock, StockIn,StockOut, Inventory, Process, ProductStockIn, ProductStockOut } from './pages';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginLayout />}>
                    <Route index element={<Login />} />
                </Route>
                <Route path="/" element={<UserLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="items" element={<Items />} />
                    <Route path="suppliers" element={<Suppliers />} />
                    <Route path="stock" element={<Stock />} />
                    <Route path="products" element={<StockIn />} />
                    <Route path="StockOut" element={<StockOut />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="process" element={<Process />} />
                    <Route path="product-stock-in" element={<ProductStockIn />} />
                    <Route path="product-stock-out" element={<ProductStockOut />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
