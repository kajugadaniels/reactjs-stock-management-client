import React,{ useState } from 'react'
import ProductStockInCreate from './ProductStock/ProductStockInCreate';

const ProductStockIn = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleProductStockInCreateModal = () => {
        setIsModalOpen(!isModalOpen);
    };
    
    return (
        <div className="p-4">

            <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-card text-card-foreground p-6 rounded-lg shadow">
                    <div className="text-muted-foreground">Total Packeging In Stock</div>
                    <div className="text-primary mt-5 text-2xl">600</div>
                </div>
                <div className="bg-card text-card-foreground p-6 rounded-lg shadow">
                    <div className="text-muted-foreground">Total 5 Kg</div>
                    <div className="text-primary mt-5 text-2xl">500</div>
                </div>
                <div className="bg-gray-300 text-card-foreground p-6 rounded-lg shadow">
                    <div className="text-muted-foreground">Total 10 kg</div>
                    <div className="text-primary mt-5 text-2xl">400</div>
                </div>
                <div className="bg-[#f9d8c0] text-card-foreground p-6 rounded-lg shadow">
                    <div className="text-muted-foreground">Total 25 kg</div>
                    <div className="text-primary mt-5 text-2xl">250</div>
                </div>
            </div>

            <div className="flex space-x-2 mb-4">
            <div className="mb-4">
                    <button className="bg-[#00BDD6] text-white px-4 py-2 rounded-md" onClick={toggleProductStockInCreateModal}>
                        Product stockIn
                    </button>
                </div>
                <ProductStockInCreate isOpen={isModalOpen} onClose={toggleProductStockInCreateModal} />
                <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Product Stock In</button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg">Product Stock Out</button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-zinc-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">Check</th>
                            <th className="px-4 py-2 border-b">Stock IN ID</th>
                            <th className="px-4 py-2 border-b">Package Id</th>
                            <th className="px-4 py-2 border-b">Finished Product</th>
                            <th className="px-4 py-2 border-b">Package</th>
                            <th className="px-4 py-2 border-b">Quantity</th>
                            <th className="px-4 py-2 border-b">Employee</th>
                            <th className="px-4 py-2 border-b">Comment</th>
                            <th className="px-4 py-2 border-b">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 border-b"><input type="checkbox" /></td>
                            <td className="px-4 py-2 border-b">SI - 001</td>
                            <td className="px-4 py-2 border-b">PK - 001</td>
                            <td className="px-4 py-2 border-b">SN</td>
                            <td className="px-4 py-2 border-b">5 Kg</td>
                            <td className="px-4 py-2 border-b">942</td>
                            <td className="px-4 py-2 border-b">Uwimana Jacky</td>
                            <td className="px-4 py-2 border-b">Add comment if any</td>
                            <td className="px-4 py-2 border-b">11/04/2023</td>
                        </tr>


                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductStockIn