import React from 'react';
import { Link } from 'react-router-dom';
import { BeakerIcon, ArchiveIcon } from '@heroicons/react/outline';

const FinishedStockCard = ({ title, description, icon, route }) => (
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

const FinishedStock = () => {
    return (
        <div className="container mx-auto py-32 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Finished Stock Management</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <FinishedStockCard
                    title="Raw Materials Finished Products"
                    description="View and manage your finished products made from raw materials."
                    icon={<BeakerIcon className="h-8 w-8 text-[#00BDD6]" />}
                    route="/finished-products"
                />
                <FinishedStockCard
                    title="Packaging Stock"
                    description="Track and manage your packaging materials inventory."
                    icon={<ArchiveIcon className="h-8 w-8 text-[#00BDD6]" />}
                    route="/package-stock"
                />
            </div>
        </div>
    );
};

export default FinishedStock;