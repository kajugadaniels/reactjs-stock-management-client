import React from 'react'

const ProductStockOut = () => {
    return (
        <div className="p-4 space-y-4">
                  
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total Stock Out</h2>
            <p className="text-3xl font-bold">600</p>
          </div>
          <div className="bg-white text-zinc-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total 5 Kg Aout</h2>
            <p className="text-3xl font-bold text-teal-500">500</p>
          </div>
          <div className="bg-zinc-200 text-zinc-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total 10 kg Out</h2>
            <p className="text-3xl font-bold text-zinc-600">400</p>
          </div>
          <div className="bg-orange-200 text-zinc-800 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Total 25 kg Out</h2>
            <p className="text-3xl font-bold text-orange-600">250</p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button className="bg-teal-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-teal-600">+ Product Stock Out</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600">Product Stock In</button>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-orange-600">Product Stock Out</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-zinc-100">
              <tr>
                <th className="px-4 py-2 border">Check</th>
                <th className="px-4 py-2 border">Stock OUT ID</th>
                <th className="px-4 py-2 border">PS IN ID</th>
                <th className="px-4 py-2 border">Location</th>
                <th className="px-4 py-2 border">Employee</th>
                <th className="px-4 py-2 border">Plate Number</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Loading Payment Status</th>
                <th className="px-4 py-2 border">Comment</th>
                <th className="px-4 py-2 border">Date</th>
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