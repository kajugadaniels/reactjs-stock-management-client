import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardListIcon, CubeIcon } from '@heroicons/react/outline';
import ItemInventory from './ItemInventory';  // Import ItemInventory component
import ProductionInventory from './ProductionInventory';  // Import ProductionInventory component

const InventoryCard = ({ title, description, icon, onClick, isSelected }) => (
    <div
        onClick={onClick}
        className={`cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${isSelected ? 'border-2 border-[#00BDD6]' : ''}`}
    >
        <div className="p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                {icon}
            </div>
            <p className="text-gray-600">{description}</p>
        </div>
        <div className="bg-[#00BDD6] px-6 py-3">
            <span className="font-medium text-white">View Inventory</span>
        </div>
    </div>
);

const Inventory = () => {
    const [selectedInventory, setSelectedInventory] = useState('ItemInventory');

    return (
        <div className="container px-4 py-12 mx-auto">
            <h1 className="mb-8 text-3xl font-bold text-gray-800">Inventory Management</h1>

            <div className="grid gap-8 mb-12 md:grid-cols-2">
                <InventoryCard
                    title="Item Inventory"
                    description="View and manage your raw materials and supplies inventory."
                    icon={<ClipboardListIcon className="h-8 w-8 text-[#00BDD6]" />}
                    onClick={() => setSelectedInventory('ItemInventory')}
                    isSelected={selectedInventory === 'ItemInventory'}
                />
                <InventoryCard
                    title="Production Inventory"
                    description="Track and manage your finished products and packaging inventory."
                    icon={<CubeIcon className="h-8 w-8 text-[#00BDD6]" />}
                    onClick={() => setSelectedInventory('ProductionInventory')}
                    isSelected={selectedInventory === 'ProductionInventory'}
                />
            </div>

            <div>
                {selectedInventory === 'ItemInventory' ? <ItemInventory /> : <ProductionInventory />}
            </div>
        </div>
    );
};

export default Inventory;
