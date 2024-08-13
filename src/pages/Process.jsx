import React from 'react';
import { Link } from 'react-router-dom';
import { BeakerIcon, CubeTransparentIcon } from '@heroicons/react/outline';

const ProcessCard = ({ title, description, icon, route }) => (
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
            <span className="text-white font-medium">View Process</span>
        </div>
    </Link>
);

const Process = () => {
    return (
        <div className="container mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Production Processes</h1>
            <div className="grid md:grid-cols-2 gap-8">
                <ProcessCard
                    title="Process Raw Materials"
                    description="Manage and track the processing of raw materials into finished products."
                    icon={<BeakerIcon className="h-8 w-8 text-[#00BDD6]" />}
                    route="/process-raw-materials"
                />
                <ProcessCard
                    title="Packaging Process"
                    description="Oversee the packaging process for finished products."
                    icon={<CubeTransparentIcon className="h-8 w-8 text-[#00BDD6]" />}
                    route="/packages-stock-out"
                />
            </div>
        </div>
    );
};

export default Process;