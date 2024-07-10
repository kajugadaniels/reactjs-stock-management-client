import React from 'react'

const Inventory = () => {
    return (
        <div className="p-6">
            <h1 className="text-xl mb-4">Inventory</h1>
            <div className="mb-6">
                <h2 className="text-lg ">Jabana Industry Inventory Report</h2>
                <div className="flex items-center space-x-4 mt-4 ml-28 text-gray-500 p-4">
                    <select className="border  px-10 py-3 border-zinc-300 rounded p-2">
                        <option>Select Stock</option>
                    </select>
                </div>
            </div>
            <div className="flex items-center gap-20 mb-6">
                <div>
                    <label className="block mb-1">From</label>
                    <input type="date" className="border border-zinc-300 px-10 py-3 rounded p-2 text-gray-500" defaultValue="2021-02-09" />
                </div>
                <div>
                    <label className="block mb-1">To</label>
                    <input type="date" className="border border-zinc-300 px-10 py-3 rounded p-2 text-gray-500" defaultValue="2021-02-09" />
                </div>
            </div>
            <table className="min-w-full bg-white border border-zinc-300">
    <thead>
        <tr>
            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Item</th>
            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Type</th>
            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Stock In</th>
            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Stock Out</th>
            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Remaining</th>
            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Percentage</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td className="py-2 px-4 border-b">Ibigori</td>
            <td className="py-2 px-4 border-b">Umweru</td>
            <td className="py-2 px-4 border-b">10 T</td>
            <td className="py-2 px-4 border-b">9 T</td>
            <td className="py-2 px-4 border-b">1 T</td>
            <td className="py-2 px-4 border-b">90%</td>
        </tr>
        <tr>
            <td className="py-2 px-4 border-b">Ibigori</td>
            <td className="py-2 px-4 border-b">Umuhondo</td>
            <td className="py-2 px-4 border-b">5 T</td>
            <td className="py-2 px-4 border-b">3 T</td>
            <td className="py-2 px-4 border-b">2 T</td>
            <td className="py-2 px-4 border-b">80%</td>
        </tr>
        <tr>
            <td className="py-2 px-4 border-b">Imifuka</td>
            <td className="py-2 px-4 border-b">SN 5 kg</td>
            <td className="py-2 px-4 border-b">1000</td>
            <td className="py-2 px-4 border-b">800</td>
            <td className="py-2 px-4 border-b">200</td>
            <td className="py-2 px-4 border-b">70%</td>
        </tr>
        <tr>
            <td className="py-2 px-4 border-b">Imifuka</td>
            <td className="py-2 px-4 border-b">Magic 25 kg</td>
            <td className="py-2 px-4 border-b">300</td>
            <td className="py-2 px-4 border-b">200</td>
            <td className="py-2 px-4 border-b">100</td>
            <td className="py-2 px-4 border-b">20%</td>
        </tr>
        <tr className="bg-orange-100">
            <td className="py-2 px-4 border-b">Imifuka</td>
            <td className="py-2 px-4 border-b">Jabana 5 kg</td>
            <td className="py-2 px-4 border-b">400</td>
            <td className="py-2 px-4 border-b">400</td>
            <td className="py-2 px-4 border-b">0</td>
            <td className="py-2 px-4 border-b">0%</td>
        </tr>
        <tr>
            <td className="py-2 px-4 border-b">Ibigori</td>
            <td className="py-2 px-4 border-b">Umweru</td>
            <td className="py-2 px-4 border-b">10 T</td>
            <td className="py-2 px-4 border-b">9 T</td>
            <td className="py-2 px-4 border-b">1 T</td>
            <td className="py-2 px-4 border-b">20%</td>
        </tr>
    </tbody>
</table>

        </div>
    )
}

export default Inventory