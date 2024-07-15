import React,{useState} from 'react'
import ProductStockOutCreate from './ProductStockOut/ProductStockOutCreate';
const ProductStockOut = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleProductStockOutCreateModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className="p-4 space-y-4">

            <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Total Stock Out</h2>
                    <p className="text-3xl m-5 font-bold">600</p>
                </div>
                <div className="bg-white text-zinc-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Total 5 Kg Aout</h2>
                    <p className="text-3xl m-5 font-bold text-teal-500">500</p>
                </div>
                <div className="bg-zinc-200 text-zinc-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Total 10 kg Out</h2>
                    <p className="text-3xl m-5 font-bold text-zinc-600">400</p>
                </div>
                <div className="bg-orange-200 text-zinc-800 p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Total 25 kg Out</h2>
                    <p className="text-3xl m-5 font-bold text-orange-600">250</p>
                </div>
            </div>

            <div className="flex space-x-2">
                <div className="mb-4">
                    <button className="bg-[#00BDD6] text-white px-4 py-2 rounded-md" onClick={toggleProductStockOutCreateModal}>
                        Product stockIn
                    </button>
                </div>
                <ProductStockOutCreate isOpen={isModalOpen} onClose={toggleProductStockOutCreateModal} />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-zinc-100">
                        <tr>
                            <th className="px-4 py-2 border text-gray-500">Check</th>
                            <th className="px-4 py-2 border text-gray-500">Stock OUT ID</th>
                            <th className="px-4 py-2 border text-gray-500">PS IN ID</th>
                            <th className="px-4 py-2 border text-gray-500">Location</th>
                            <th className="px-4 py-2 border text-gray-500">Employee</th>
                            <th className="px-4 py-2 border text-gray-500">Plate Number</th>
                            <th className="px-4 py-2 border text-gray-500">Phone</th>
                            <th className="px-4 py-2 border text-gray-500">Loading Payment Status</th>
                            <th className="px-4 py-2 border text-gray-500">Comment</th>
                            <th className="px-4 py-2 border text-gray-500">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 border text-center"><input type="checkbox" /></td>
                            <td className="px-4 py-2 border">SU - 001</td>
                            <td className="px-4 py-2 border">SI - 001</td>
                            <td className="px-4 py-2 border">Shoop</td>
                            <td className="px-4 py-2 border">Kibogora Enock</td>
                            <td className="px-4 py-2 border">RAD 304 J</td>
                            <td className="px-4 py-2 border">(250) 788-965-501</td>
                            <td className="px-4 py-2 border text-teal-500">Payed</td>
                            <td className="px-4 py-2 border">Any Comment</td>
                            <td className="px-4 py-2 border">11/04/2020</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductStockOut