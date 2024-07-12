import React from 'react'

const Inventory = () => {
    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4 flex gap-3">Inventory:
                <div className="mb-6 flex gap-2">
                    <h2 className="text-lg font-semibold typing-demo">Jabana Industry</h2>
                    <p className="text-[#93d3db] text-muted-foreground typing-demo" style={{ animationDelay: '2s' }}>Inventory Report</p>
                </div>
            </h1>
            <div className="flex  items-center mb-6 ml-60 ">
                <label className="block">
                    <span className="text-zinc-700 ">Select Stock</span>
                    <select className="mt-1 block w-full py-4 px-10 border border-zinc-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                        <option>Select Stock</option>
                    </select>
                </label>
            </div>
            <div className="flex items-center ml-40 gap-20 mb-6">
                <label className="block">
                    <span className="text-zinc-700">From</span>
                    <input type="date" className="mt-1 block w-full py-4 px-6 border border-zinc-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm " />
                </label>
                <label className="block">
                    <span className="text-zinc-700">To</span>
                    <input type="date" className="mt-1 block w-full py-4 px-6 border border-zinc-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                </label>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-zinc-200">
                    <thead className="bg-zinc-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Item</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Stock In</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Stock Out</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Remaining</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">Percentage</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-zinc-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Ibigori</td>
                            <td className="px-6 py-4 whitespace-nowrap">Umweru</td>
                            <td className="px-6 py-4 whitespace-nowrap">10 T</td>
                            <td className="px-6 py-4 whitespace-nowrap">9 T</td>
                            <td className="px-6 py-4 whitespace-nowrap">1 T</td>
                            <td className="px-6 py-4 whitespace-nowrap">90 %</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Ibigori</td>
                            <td className="px-6 py-4 whitespace-nowrap">Umuhondo</td>
                            <td className="px-6 py-4 whitespace-nowrap">5 T</td>
                            <td className="px-6 py-4 whitespace-nowrap">3 T</td>
                            <td className="px-6 py-4 whitespace-nowrap">2 T</td>
                            <td className="px-6 py-4 whitespace-nowrap">80 %</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Imifuka</td>
                            <td className="px-6 py-4 whitespace-nowrap">SN 5 kg</td>
                            <td className="px-6 py-4 whitespace-nowrap">1000</td>
                            <td className="px-6 py-4 whitespace-nowrap">800</td>
                            <td className="px-6 py-4 whitespace-nowrap">200</td>
                            <td className="px-6 py-4 whitespace-nowrap">70 %</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap">Imifuka</td>
                            <td className="px-6 py-4 whitespace-nowrap">Magic 25 kg</td>
                            <td className="px-6 py-4 whitespace-nowrap">300</td>
                            <td className="px-6 py-4 whitespace-nowrap">200</td>
                            <td className="px-6 py-4 whitespace-nowrap">100</td>
                            <td className="px-6 py-4 whitespace-nowrap">20 %</td>
                        </tr>
                        <tr className="bg-orange-100">
                            <td className="px-6 py-4 whitespace-nowrap">Imifuka</td>
                            <td className="px-6 py-4 whitespace-nowrap">Jabana 5 kg</td>
                            <td className="px-6 py-4 whitespace-nowrap">400</td>
                            <td className="px-6 py-4 whitespace-nowrap">400</td>
                            <td className="px-6 py-4 whitespace-nowrap">0</td>
                            <td className="px-6 py-4 whitespace-nowrap">0 %</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Inventory