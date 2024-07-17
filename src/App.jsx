import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LoginLayout, UserLayout } from './layouts';
import { Dashboard, Login, Items, Suppliers, Stock, StockIn,StockOut, Inventory, Process, ProductStockIn, ProductStockOut } from './pages';
import  TotalPackeging from './pages/totalStockin/TotalPackeging';
import TotalRowMaterial from './pages/totalStockin/TotalRowMaterial';
import TotalPackegingOut from './pages/totalStockout/TotalPackegingOut';
import TotalRowMaterialOut from './pages/totalStockout/TotalRowMaterialOut';

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
                    <Route path="/totalRowMaterial" element={<TotalRowMaterial />} />
                    <Route path="/totalPackeging" element={<TotalPackeging />} />
                    <Route path="/totalRowMaterialOut" element={<TotalRowMaterialOut />} />
                    <Route path="/totalPackegingOut" element={<TotalPackegingOut />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
