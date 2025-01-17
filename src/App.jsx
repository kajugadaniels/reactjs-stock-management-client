import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { LoginLayout, UserLayout } from './layouts';
import { Dashboard, Users, FinishedProduct, FinishedStock, Inventory, ItemInventory, Items, Login, PackageStock, Process, ProductStockIn, ProductStockOut, ProductionInventory, Stock, StockIn, StockOut, Suppliers, ChangePassword } from './pages';
import TotalPackeging from './pages/totalStockin/TotalPackeging';
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
                <Route element={<UserLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="users" element={<Users />} />
                    <Route path="items" element={<Items />} />
                    <Route path="suppliers" element={<Suppliers />} />
                    <Route path="stock" element={<Stock />} />
                    <Route path="products" element={<StockIn />} />
                    <Route path="StockOut" element={<StockOut />} />
                    <Route path="inventory" element={<Inventory />} />
                    <Route path="items-inventory" element={<ItemInventory />} />
                    <Route path="process" element={<Process />} />
                    <Route path="finished-products" element={<FinishedProduct />} />
                    <Route path="product-stock-in" element={<ProductStockIn />} />
                    <Route path="production-inventory" element={<ProductionInventory />} />
                    <Route path="product-stock-out" element={<ProductStockOut />} />
                    <Route path="totalRowMaterial" element={<TotalRowMaterial />} />
                    <Route path="totalPackeging" element={<TotalPackeging />} />
                    <Route path="totalRowMaterialOut" element={<TotalRowMaterialOut />} />
                    <Route path="totalPackegingOut" element={<TotalPackegingOut />} />
                    <Route path="package-stock" element={<PackageStock />} />
                    <Route path="finished-stock" element={<FinishedStock />} />
                    <Route path="change-password" element={<ChangePassword />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;