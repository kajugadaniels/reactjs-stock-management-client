import React from 'react'

const Process = () => {
    return (
        <div className="p-4">
            <h1 className="text-lg mb-4 p-10">Production_process, Finished product and Packaging</h1>
            <div className="grid grid-cols-4 gap-4 mb-4 text-gray-500">
                <div className="bg-card p-4 rounded-lg shadow">
                    <h2 className="text-muted-foreground ">Total Requested</h2>
                    <p className="text-primary m-5  text-2xl text-[#00BDD6]">600 T</p>
                </div>
                <div className="bg-card p-4 rounded-lg shadow">
                    <h2 className="text-muted-foreground">Total Pending</h2>
                    <p className="text-primary m-5  text-2xl  text-[#00BDD6]">500 T</p>
                </div>
                <div className="bg-card p-4 rounded-lg shadow">
                    <h2 className="text-muted-foreground">Total Complete</h2>
                    <p className="text-primary m-5  text-2xl  text-[#00BDD6]">5</p>
                </div>
                <div className="bg-card  rounded-lg p-4 shadow">
                    <h2 className="text-muted-foreground">Total Remaining</h2>
                    <p className="text-primary m-5 text-2xl  text-[#00BDD6]">2</p>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full p-10 bg-white border border-zinc-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Check</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Production Process ID</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Item Name</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Stocout Item</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Type</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Quanti</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Status</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Process</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Finished</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Packaging</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 border-b text-center"><input type="checkbox" /></td>
                            <td className="px-4 py-2 border-b">PRP - 001</td>
                            <td className="px-4 py-2 border-b">Magic</td>
                            <td className="px-4 py-2 border-b">Ibigori</td>
                            <td className="px-4 py-2 border-b">Umweru</td>
                            <td className="px-4 py-2 border-b">100</td>
                            <td className="px-4 py-2 border-b">Pending</td>
                            <td className="px-4 py-2 border-b"><button className="bg-yellow-500 text-accent-foreground px-2 py-1 rounded">Proceed</button></td>
                            <td className="px-4 py-2 border-b"><button className="bg-green-500 text-white px-2 py-1 rounded">Finished</button></td>
                            <td className="px-4 py-2 border-b"><button className="bg-blue-500 text-white px-2 py-1 rounded">Package</button></td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border-b text-center"><input type="checkbox" /></td>
                            <td className="px-4 py-2 border-b">PRP - 001</td>
                            <td className="px-4 py-2 border-b">SN</td>
                            <td className="px-4 py-2 border-b">Ibigori</td>
                            <td className="px-4 py-2 border-b">Umweru</td>
                            <td className="px-4 py-2 border-b">100</td>
                            <td className="px-4 py-2 border-b">Pending</td>
                            <td className="px-4 py-2 border-b"><button className="bg-accent text-accent-foreground px-2 py-1 rounded bg-yellow-500">Proceed</button></td>
                            <td className="px-4 py-2 border-b"><button className="bg-green-500 text-white px-2 py-1 rounded">Finished</button></td>
                            <td className="px-4 py-2 border-b"><button className="bg-blue-500 text-white px-2 py-1 rounded">Package</button></td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border-b text-center"><input type="checkbox" /></td>
                            <td className="px-4 py-2 border-b">PRP - 001</td>
                            <td className="px-4 py-2 border-b">JBN</td>
                            <td className="px-4 py-2 border-b">Ibigori</td>
                            <td className="px-4 py-2 border-b">Umuhondo</td>
                            <td className="px-4 py-2 border-b">100</td>
                            <td className="px-4 py-2 border-b">Pending</td>
                            <td className="px-4 py-2 border-b"><button className="bg-accent text-accent-foreground px-2 py-1 rounded bg-yellow-500">Proceed</button></td>
                            <td className="px-4 py-2 border-b"><button className="bg-green-500 text-white px-2 py-1 rounded">Finished</button></td>
                            <td className="px-4 py-2 border-b"><button className="bg-blue-500 text-white px-2 py-1 rounded">Package</button></td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border-b text-center"><input type="checkbox" /></td>
                            <td className="px-4 py-2 border-b">PRP - 001</td>
                            <td className="px-4 py-2 border-b">JBN</td>
                            <td className="px-4 py-2 border-b">Ibigori</td>
                            <td className="px-4 py-2 border-b">Umuhondo</td>
                            <td className="px-4 py-2 border-b">100</td>
                            <td className="px-4 py-2 border-b">Pending</td>
                            <td className="px-4 py-2 border-b"><button className="bg-accent text-accent-foreground px-2 py-1 rounded bg-yellow-500">Proceed</button></td>
                            <td className="px-4 py-2 border-b"><button className="bg-green-500 text-white px-2 py-1 rounded">Finished</button></td>
                            <td className="px-4 py-2 border-b"><button className="bg-blue-500 text-white px-2 py-1 rounded">Package</button></td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border-b text-center"><input type="checkbox" /></td>
                            <td className="px-4 py-2 border-b">PRP - 001</td>
                            <td className="px-4 py-2 border-b">JBN</td>
                            <td className="px-4 py-2 border-b">Ibigori</td>
                            <td className="px-4 py-2 border-b">Umuhondo</td>
                            <td className="px-4 py-2 border-b">100</td>
                            <td className="px-4 py-2 border-b">Pending</td>
                            <td className="px-4 py-2 border-b"><button className="bg-accent text-accent-foreground px-2 py-1 rounded bg-yellow-500">Proceed</button></td>
                            <td className="px-4 py-2 border-b"><button className="bg-green-500 text-white px-2 py-1 rounded">Finished</button></td>
                            <td className="px-4 py-2 border-b"><button className="bg-blue-500 text-white px-2 py-1 rounded">Package</button></td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 border-b text-center"><input type="checkbox" /></td>
                            <td className="px-4 py-2 border-b">PRP - 001</td>
                            <td className="px-4 py-2 border-b">JBN</td>
                            <td className="px-4 py-2 border-b">Ibigori</td>
                            <td className="px-4 py-2 border-b">Umuhondo</td>
                            <td className="px-4 py-2 border-b">100</td>
                            <td className="px-4 py-2 border-b">Pending</td>
                            <td className="px-4 py-2 border-b"><button className="bg-accent text-accent-foreground px-2 py-1 rounded bg-yellow-500">Proceed</button></td>
                            <td className="px-4 py-2 border-b"><button className="bg-green-500 text-white px-2 py-1 rounded">Finished</button></td>
                            <td className="px-4 py-2 border-b"><button className="bg-blue-500 text-white px-2 py-1 rounded">Package</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Process