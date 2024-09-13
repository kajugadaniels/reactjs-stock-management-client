import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import DataTable from 'react-data-table-component';
import { SearchIcon } from '@heroicons/react/solid';
import {
    ArchiveIcon,
    BeakerIcon,
    CubeIcon,
    TruckIcon
} from '@heroicons/react/outline';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        rawMaterialsStockIn: 0,
        rawMaterialsStockOut: 0,
        packagesStockIn: 0,
        packagesStockOut: 0,
        recentStockIns: [],
        recentStockOuts: [],
        inventoryTrends: {},
        productionOverview: {},
    });

    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allTypes, setAllTypes] = useState([]);
    const [filteredTypes, setFilteredTypes] = useState([]);
    const [productionInventory, setProductionInventory] = useState([]);
    const [filterText, setFilterText] = useState('');

    const today = new Date();
    const localDate = today.toLocaleDateString('en-CA');

    const [filters, setFilters] = useState({
        category: '',
        type: '',
        name: '',
        date: localDate
    });

    useEffect(() => {
        fetchDashboardData();
        fetchCategories();
        fetchTypes();
        fetchInventory();
        fetchProductionInventory();
    }, [filters]);

    const fetchDashboardData = async () => {
        try {
            const [dashboardResponse, rawMaterialsResponse, packagesResponse] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/dashboard`),
                axios.get(`${import.meta.env.VITE_API_URL}/inventory/raw-materials`),
                axios.get(`${import.meta.env.VITE_API_URL}/inventory/packages`)
            ]);

            setDashboardData({
                ...dashboardResponse.data,
                rawMaterialsStockIn: rawMaterialsResponse.data.stockIn,
                rawMaterialsStockOut: rawMaterialsResponse.data.stockOut,
                packagesStockIn: packagesResponse.data.stockIn,
                packagesStockOut: packagesResponse.data.stockOut,
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError('Failed to load dashboard data');
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
            const filteredCategories = response.data.filter(category => category.name !== 'Finished');
            setCategories(filteredCategories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchTypes = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/types`);
            setAllTypes(response.data);
            setFilteredTypes(response.data);
        } catch (error) {
            console.error('Error fetching types:', error);
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

    const fetchProductionInventory = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/production-inventory`);
            setProductionInventory(response.data);
        } catch (error) {
            console.error('Error fetching production inventory:', error);
            setError('Failed to fetch production inventory data');
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
                <h3 className="text-sm font-semibold text-gray-800 md:text-lg">{title}</h3>
                <p className="text-xl font-bold md:text-2xl">{value}</p>
            </div>
        </div>
    );

    const RecentActivityTable = ({ title, data, type }) => (
        <div className="p-4 overflow-x-auto bg-white rounded-lg shadow-md md:p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-800 md:text-lg">{title}</h3>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:px-6 md:py-3 md:text-sm">Date</th>
                        <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:px-6 md:py-3 md:text-sm">Item</th>
                        <th className="px-4 py-2 text-xs font-medium tracking-wider text-left text-gray-500 uppercase md:px-6 md:py-3 md:text-sm">Quantity</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td className="px-4 py-2 text-xs text-gray-500 md:px-6 md:py-4 md:text-sm whitespace-nowrap">{item.date}</td>
                            <td className="px-4 py-2 text-xs font-medium text-gray-900 md:px-6 md:py-4 md:text-sm whitespace-nowrap">{item.item_name}</td>
                            <td className="px-4 py-2 text-xs text-gray-500 md:px-6 md:py-4 md:text-sm whitespace-nowrap">
                                {type === 'in' ? '+' : '-'}{item.quantity}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const inventoryColumns = [
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
            name: 'Available',
            selector: (row) => row.available_quantity,
            sortable: true,
            cell: row => {
                const availableQuantity = row.available_quantity;
                return (
                    <span className={availableQuantity <= 0 ? 'text-red-600 font-semibold' : ''}>
                        {availableQuantity <= 0 ? 'Stock Out' : availableQuantity}
                    </span>
                );
            },
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
    ];

    const productionColumns = [
        {
            name: 'Item',
            selector: (row) => row.item_name,
            sortable: true,
            cell: row => (
                <div>
                    <div>{row.item_name}</div>
                    <div className="text-xs text-gray-500">
                        {row.package_type}
                    </div>
                </div>
            ),
        },
        {
            name: 'Available',
            selector: row => row.available_quantity,
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
        {
            name: 'Stock In',
            selector: row => row.total_stock_in,
            sortable: true,
        },
        {
            name: 'Stock Out',
            selector: row => row.total_stock_out,
            sortable: true,
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

    const productionFilteredItems = productionInventory.filter(
        item => item.item_name && item.item_name.toLowerCase().includes(filterText.toLowerCase()),
    );

    const subHeaderComponentMemo = React.useMemo(() => {
        return (
            <div className="relative">
                <input
                    type="text"
                    placeholder="Filter by Item Name"
                    className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00BDD6] focus:border-transparent"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                />
                <SearchIcon className="absolute w-5 h-5 text-gray-400 left-3 top-2.5" />
            </div>
        );
    }, [filterText]);

    // const productionOverviewOptions = {
    //     scales: {
    //         xAxes: [{
    //             type: 'time',
    //             time: {
    //                 unit: 'month',
    //                 displayFormats: {
    //                     month: 'MMMM' 
    //                 }
    //             },
    //             scaleLabel: {
    //                 display: true,
    //                 labelString: 'Month'
    //             }
    //         }],
    //         yAxes: [{
    //             ticks: {
    //                 beginAtZero: true
    //             },
    //             scaleLabel: {
    //                 display: true,
    //                 labelString: 'Quantity'
    //             }
    //         }]
    //     },
    //     responsive: true,
    //     plugins: {
    //         legend: {
    //             position: 'top'
    //         }
    //     }
    // };




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

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <div className="w-16 h-16 mb-4 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader"></div>
                    <p className="text-xl font-semibold text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl font-semibold text-red-600">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="container px-4 py-8 mx-auto mt-20">
            <h1 className="mb-8 text-2xl font-bold text-gray-800 md:text-3xl">Dashboard</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Raw Materials Stock In"
                    value={dashboardData.rawMaterialsStockIn.toLocaleString()}
                    icon={<BeakerIcon className="w-6 h-6 text-blue-500 md:w-8 md:h-8" />}
                    color="bg-blue-100"
                />
                <StatCard
                    title="Raw Materials Stock Out"
                    value={dashboardData.rawMaterialsStockOut.toLocaleString()}
                    icon={<TruckIcon className="w-6 h-6 text-red-500 md:w-8 md:h-8" />}
                    color="bg-red-100"
                />
                <StatCard
                    title="Packages Stock In"
                    value={dashboardData.packagesStockIn.toLocaleString()}
                    icon={<ArchiveIcon className="w-6 h-6 text-green-500 md:w-8 md:h-8" />}
                    color="bg-green-100"
                />
                <StatCard
                    title="Packages Stock Out"
                    value={dashboardData.packagesStockOut.toLocaleString()}
                    icon={<CubeIcon className="w-6 h-6 text-purple-500 md:w-8 md:h-8" />}
                    color="bg-purple-100"
                />
            </div>

            <div className="flex flex-col mt-6 mb-6 space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                <div className="flex-1 p-4 overflow-x-auto bg-white rounded-lg shadow-md md:p-6">
                    <h3 className="mb-4 text-sm font-semibold text-gray-800 md:text-lg">Item Inventory</h3>
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
                            <label className="block mb-1 text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                name="date"
                                value={filters.date}
                                onChange={handleFilterChange}
                                max={localDate}
                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#00BDD6] focus:border-[#00BDD6]"
                            />
                        </div>
                    </div>
                    <DataTable
                        columns={inventoryColumns}
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

                <div className="flex-1 p-4 overflow-x-auto bg-white rounded-lg shadow-md md:p-6">
                    <h3 className="mb-4 text-sm font-semibold text-gray-800 md:text-lg">Production Inventory</h3>
                    <DataTable
                        columns={productionColumns}
                        data={productionFilteredItems}
                        pagination
                        customStyles={customStyles}
                        subHeader
                        subHeaderComponent={subHeaderComponentMemo}
                    />
                </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-md md:p-6">
                <h3 className="mb-4 text-sm font-semibold text-gray-800 md:text-lg">Production Overview</h3>
                <Bar options={productionOverviewOptions} data={dashboardData.productionOverview} />
            </div>
        </div>
    );
};

export default Dashboard;