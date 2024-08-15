import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ChartBarIcon,
    CubeIcon,
    TruckIcon,
    CurrencyDollarIcon,
    ExclamationCircleIcon
} from '@heroicons/react/outline';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        totalInventoryValue: 0,
        lowStockItems: 0,
        recentStockIns: [],
        recentStockOuts: [],
        topSellingItems: [],
        inventoryTrends: {},
        productionOverview: {},
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/dashboard`);
            setDashboardData(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div className={`bg-white rounded-lg shadow-md p-4 md:p-6 flex items-center ${color} mb-4 md:mb-0`}>
            <div className="mr-4">{icon}</div>
            <div>
                <h3 className="text-sm md:text-lg font-semibold text-gray-800">{title}</h3>
                <p className="text-xl md:text-2xl font-bold">{value}</p>
            </div>
        </div>
    );

    const RecentActivityTable = ({ title, data, type }) => (
        <div className="p-4 md:p-6 bg-white rounded-lg shadow-md overflow-x-auto">
            <h3 className="mb-4 text-sm md:text-lg font-semibold text-gray-800">{title}</h3>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm font-medium tracking-wider text-left text-gray-500 uppercase">Item</th>
                        <th className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm font-medium tracking-wider text-left text-gray-500 uppercase">Quantity</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 md:px-6 md:py-4 text-xs md:text-sm text-gray-500 whitespace-nowrap">{item.date}</td>
                            <td className="px-4 py-2 md:px-6 md:py-4 text-xs md:text-sm font-medium text-gray-900 whitespace-nowrap">{item.item_name}</td>
                            <td className="px-4 py-2 md:px-6 md:py-4 text-xs md:text-sm text-gray-500 whitespace-nowrap">
                                {type === 'in' ? '+' : '-'}{item.quantity}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const inventoryTrendsOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Inventory Trends',
            },
        },
    };

    const productionOverviewOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Production Overview',
            },
        },
    };

    if (loading) return <div className="mt-8 text-center">Loading dashboard...</div>;
    if (error) return <div className="mt-8 text-center text-red-600">{error}</div>;

    return (
        <div className="container px-4 py-8 mx-auto mt-20">
            <h1 className="mb-8 text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Inventory Value"
                    value={`$${dashboardData.totalInventoryValue.toLocaleString()}`}
                    icon={<CurrencyDollarIcon className="w-6 h-6 md:w-8 md:h-8 text-green-500" />}
                    color="bg-green-100"
                />
                <StatCard
                    title="Low Stock Items"
                    value={dashboardData.lowStockItems}
                    icon={<ExclamationCircleIcon className="w-6 h-6 md:w-8 md:h-8 text-red-500" />}
                    color="bg-red-100"
                />
                <StatCard
                    title="Total Stock In"
                    value={dashboardData.totalStockIn}
                    icon={<TruckIcon className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />}
                    color="bg-blue-100"
                />
                <StatCard
                    title="Total Stock Out"
                    value={dashboardData.totalStockOut}
                    icon={<CubeIcon className="w-6 h-6 md:w-8 md:h-8 text-purple-500" />}
                    color="bg-purple-100"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-8">
                <RecentActivityTable title="Recent Stock Ins" data={dashboardData.recentStockIns} type="in" />
                <RecentActivityTable title="Recent Stock Outs" data={dashboardData.recentStockOuts} type="out" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-8">
                <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
                    <h3 className="mb-4 text-sm md:text-lg font-semibold text-gray-800">Inventory Trends</h3>
                    <Line options={inventoryTrendsOptions} data={dashboardData.inventoryTrends} />
                </div>
                <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
                    <h3 className="mb-4 text-sm md:text-lg font-semibold text-gray-800">Production Overview</h3>
                    <Bar options={productionOverviewOptions} data={dashboardData.productionOverview} />
                </div>
            </div>

            <div className="p-4 md:p-6 bg-white rounded-lg shadow-md mt-8">
                <h3 className="mb-4 text-sm md:text-lg font-semibold text-gray-800">Top Selling Items</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm font-medium tracking-wider text-left text-gray-500 uppercase">Item</th>
                                <th className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm font-medium tracking-wider text-left text-gray-500 uppercase">Category</th>
                                <th className="px-4 py-2 md:px-6 md:py-3 text-xs md:text-sm font-medium tracking-wider text-left text-gray-500 uppercase">Total Sold</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dashboardData.topSellingItems.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 md:px-6 md:py-4 text-xs md:text-sm font-medium text-gray-900 whitespace-nowrap">{item.name}</td>
                                    <td className="px-4 py-2 md:px-6 md:py-4 text-xs md:text-sm text-gray-500 whitespace-nowrap">{item.category}</td>
                                    <td className="px-4 py-2 md:px-6 md:py-4 text-xs md:text-sm text-gray-500 whitespace-nowrap">{item.totalSold}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
