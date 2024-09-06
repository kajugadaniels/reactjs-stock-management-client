import {
    CubeIcon,
    ExclamationCircleIcon,
    TruckIcon
} from '@heroicons/react/outline';
import axios from 'axios';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

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

    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [filters, setFilters] = useState({
        category: '',
        type: '',
        name: '',
    });

    useEffect(() => {
        fetchDashboardData();
        fetchData();
    }, []);

    useEffect(() => {
        fetchInventory();
    }, [filters]);

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

    const fetchData = async () => {
        setLoading(true);
        try {
            const [categoriesResponse, typesResponse] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/categories`),
                axios.get(`${import.meta.env.VITE_API_URL}/types`)
            ]);

            const filteredCategories = categoriesResponse.data.filter(category => category.name !== 'Finished');
            setCategories(filteredCategories);
            setAllTypes(typesResponse.data);
            setFilteredTypes(typesResponse.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Error fetching data');
            setLoading(false);
        }
    };

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/inventory`, { params: filters });
            setItems(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching inventory:', error);
            setError('Error fetching inventory');
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'category') {
            setFilters(prevFilters => ({
                ...prevFilters,
                [name]: value,
                type: ''
            }));
            if (value) {
                const typesForCategory = allTypes.filter(type => type.category_id.toString() === value);
                setFilteredTypes(typesForCategory);
            } else {
                setFilteredTypes(allTypes);
            }
        } else {
            setFilters(prevFilters => ({
                ...prevFilters,
                [name]: value
            }));
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

    const columns = [
        {
            name: 'Item',
            selector: (row) => row.name,
            sortable: true,
            cell: row => (
                <div>
                    <div>{row.name}</div>
                    <div className="text-xs text-gray-500">
                        {row.category_name} - {row.type_name}
                    </div>
                    <div className="text-xs text-gray-500">
                        {row.capacity} {row.unit}
                    </div>
                </div>
            ),
        },
        {
            name: 'Stock In',
            selector: (row) => row.total_stock_in,
            sortable: true,
        },
        {
            name: 'Stock Out',
            selector: (row) => row.total_stock_out,
            sortable: true,
        },
        {
            name: 'Available',
            selector: (row) => row.total_stock_in - row.total_stock_out,
            sortable: true,
            cell: row => {
                const availableQuantity = row.total_stock_in - row.total_stock_out;
                return (
                    <span className={availableQuantity <= 0 ? 'text-red-600 font-semibold' : ''}>
                        {availableQuantity <= 0 ? 'Stock Out' : availableQuantity}
                    </span>
                );
            },
        },
    ];

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#f3f4f6',
                borderBottom: '2px solid #e5e7eb',
            },
        },
        headCells: {
            style: {
                fontSize: '0.875rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                color: '#374151',
            },
        },
        rows: {
            style: {
                fontSize: '0.875rem',
                backgroundColor: 'white',
                '&:nth-of-type(odd)': {
                    backgroundColor: '#f9fafb',
                },
                '&:hover': {
                    backgroundColor: '#f3f4f6',
                },
                borderBottom: '1px solid #e5e7eb',
            },
        },
    };

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
                    title="Total Packaging"
                    value={'1'}
                    // value={`${dashboardData.totalInventoryValue.toLocaleString()}`}
                    icon={<ExclamationCircleIcon className="w-6 h-6 md:w-8 md:h-8 text-green-500" />}
                    color="bg-green-100"
                />
                <StatCard
                    title="Total Raw Material"
                    value={'1'}
                    // value={dashboardData.lowStockItems}
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
                    <div className="p-4 md:p-6 bg-white rounded-lg shadow-md mt-8">
                        <h3 className="mb-4 text-sm md:text-lg font-semibold text-gray-800">Inventory Details</h3>
                        <div className="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Category</label>
                                <select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Type</label>
                                <select
                                    name="type"
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                >
                                    <option value="">All Types</option>
                                    {filteredTypes.map((type) => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Search</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Search items..."
                                        value={filters.name}
                                        onChange={handleFilterChange}
                                        className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                                    />
                                    <SearchIcon className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
                                </div>
                            </div>
                        </div>
                        <DataTable
                            columns={columns}
                            data={items}
                            pagination
                            paginationPerPage={5}
                            responsive
                            highlightOnHover
                            striped
                            progressPending={loading}
                            progressComponent={<div>Loading...</div>}
                            noDataComponent={<div className="p-4">No inventory records found</div>}
                            customStyles={customStyles}
                        />
                    </div>
                </div>
                <div className="p-4 md:p-6 bg-white rounded-lg shadow-md">
                    <h3 className="mb-4 text-sm md:text-lg font-semibold text-gray-800">Production Overview</h3>
                    <Bar options={productionOverviewOptions} data={dashboardData.productionOverview} />
                </div>
            </div>

            {/* <div className="p-4 md:p-6 bg-white rounded-lg shadow-md mt-8">
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
            </div> */}
        </div>
    );
};

export default Dashboard;