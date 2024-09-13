import React, { useState } from 'react';
import { ClipboardListIcon, CubeIcon } from '@heroicons/react/outline';
import ItemInventory from './ItemInventory';
import ProductionInventory from './ProductionInventory';

const InventoryCard = ({ title, description, icon, onClick, isSelected }) => (
    <div
        onClick={onClick}
        className={`cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${isSelected ? 'border-2 border-[#00BDD6]' : ''}`}
    >
        <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h2>
                {React.cloneElement(icon, { className: "h-6 w-6 sm:h-8 sm:w-8 text-[#00BDD6]" })}
            </div>
            <p className="text-sm sm:text-base text-gray-600">{description}</p>
        </div>
        <div className="bg-[#00BDD6] px-4 py-2 sm:px-6 sm:py-3">
            <span className="text-sm sm:text-base font-medium text-white">View Inventory</span>
        </div>
    </div>
);

const Inventory = () => {
    const [selectedInventory, setSelectedInventory] = useState('ItemInventory');

    const customStyles = {
        table: {
            style: {
                minWidth: '100%',
            },
        },
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
                padding: '12px 8px',
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
        cells: {
            style: {
                padding: '12px 8px',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
            },
        },
    };

    return (
        <div className="container px-4 py-6 mx-auto sm:py-8 md:py-12">
            <h1 className="mb-4 text-2xl font-bold text-gray-800 sm:text-3xl sm:mb-6 md:mb-8">Inventory Management</h1>
            <div className="grid gap-4 mb-6 sm:gap-6 md:gap-8 sm:grid-cols-2 sm:mb-8 md:mb-12">
                <InventoryCard
                    title="Item Inventory"
                    description="View and manage your raw materials and supplies inventory."
                    icon={<ClipboardListIcon />}
                    onClick={() => setSelectedInventory('ItemInventory')}
                    isSelected={selectedInventory === 'ItemInventory'}
                />
                <InventoryCard
                    title="Production Inventory"
                    description="Track and manage your finished products and packaging inventory."
                    icon={<CubeIcon />}
                    onClick={() => setSelectedInventory('ProductionInventory')}
                    isSelected={selectedInventory === 'ProductionInventory'}
                />
            </div>
            <div className="mt-4 sm:mt-6 md:mt-8">
                {selectedInventory === 'ItemInventory' ? 
                    <ItemInventory customStyles={customStyles} /> : 
                    <ProductionInventory customStyles={customStyles} />
                }
            </div>
        </div>
    );
};

export default Inventory;