import React from 'react'

function TotalPackeging() {
    return (
        <div className="p-4">
            <h1 className='text-2xl text-center'>Details Of Packeging <i className='text-[#00BDD6]'>In Stock</i></h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                    <thead className="bg-zinc-100 border-b">
                        <tr>
                            <th className="text-left py-2 px-4">Category</th>
                            <th className="text-left py-2 px-4">items</th>
                            <th className="text-left py-2 px-4">Type</th>
                            <th className="text-left py-2 px-4">Balance</th>
                            <th className="text-left py-2 px-4">Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="py-2 px-4">Packeging</td>
                            <td className="py-2 px-4">magic</td>
                            <td className="py-2 px-4">magic-05</td>
                            <td className="py-2 px-4">300</td>
                            <td className="py-2 px-4">Kg</td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TotalPackeging