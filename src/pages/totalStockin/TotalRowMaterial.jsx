import React from 'react'

function TotalRowMaterial() {
  return (
    <div className="p-4">
      <h1 className='text-2xl text-center'>Details Of Row Materials <i className='text-[#00BDD6]'>In Stock</i></h1>
      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-zinc-100 border-b">
            <tr>
              <th className="text-left py-2 px-4 text-gray-500">Category</th>
              <th className="text-left py-2 px-4 text-gray-500">Item</th>
              <th className="text-left py-2 px-4 text-gray-500">Type</th>
              <th className="text-left py-2 px-4 text-gray-500">Balance</th>
              <th className="text-left py-2 px-4 text-gray-500">Unit</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2 px-4 font-semibold">Row Material</td>
              <td className="py-2 px-4">Ibigori</td>
              <td className="py-2 px-4">Umweru</td>
              <td className="py-2 px-4">500</td>
              <td className="py-2 px-4">kg</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TotalRowMaterial