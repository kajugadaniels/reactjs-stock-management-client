import React from 'react'

function TotalPackeging() {
    return (
        <div className="p-4">
            <h1 className='text-2xl text-center'>Details Of Packeging <i className='text-[#00BDD6]'>In Stock</i></h1>
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-300">
    <thead className="bg-zinc-100 border-b border-gray-300">
        <tr>
            <th className="text-left py-2 px-4 text-gray-500 border-r border-gray-300">Category</th>
            <th className="text-left py-2 px-4 text-gray-500 border-r border-gray-300">Items</th>
            <th className="text-left py-2 px-4 text-gray-500 border-r border-gray-300">Type</th>
            <th className="text-left py-2 px-4 text-gray-500 border-r border-gray-300">Balance</th>
            <th className="text-left py-2 px-4 text-gray-500">Unit</th>
        </tr>
    </thead>
    <tbody>
        <tr className="border-b border-gray-300">
            <td className="py-2 px-4 font-semibold border-r border-gray-300">Packaging</td>
            <td className="py-2 px-4 border-r border-gray-300">magic</td>
            <td className="py-2 px-4 border-r border-gray-300">magic-05</td>
            <td className="py-2 px-4 border-r border-gray-300">300</td>
            <td className="py-2 px-4">Kg</td>
        </tr>
    </tbody>
</table>

            </div>
        </div>
    )
}

export default TotalPackeging