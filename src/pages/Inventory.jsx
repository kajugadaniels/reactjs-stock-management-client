import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardListIcon, CubeIcon } from '@heroicons/react/outline';

const InventoryCard = ({ title, description, icon, route }) => (
    <Link
        to={route}
        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                {icon}
            </div>
            <p className="text-gray-600">{description}</p>
        </div>
        <div className="bg-[#00BDD6] px-6 py-3">
            <span className="text-white font-medium">View Inventory</span>
        </div>
    </Link>
);

const Inventory = () => {
    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Inventory Management</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <InventoryCard
                    title="Item Inventory"
                    description="View and manage your raw materials and supplies inventory."
                    icon={<ClipboardListIcon className="h-8 w-8 text-[#00BDD6]" />}
                    route="/items-inventory"
                />
                <InventoryCard
                    title="Production Inventory"
                    description="Track and manage your finished products and packaging inventory."
                    icon={<CubeIcon className="h-8 w-8 text-[#00BDD6]" />}
                    route="/production-inventory"
                />
            </div>
        </div>
    );
};

export default Inventory;