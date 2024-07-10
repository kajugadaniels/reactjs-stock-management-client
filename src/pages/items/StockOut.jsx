import React from 'react'

function StockOut() {
  return (
    <div className="p-4">
            <h2 className="text-xl  mb-4">Stock in View</h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-card p-4 rounded-lg shadow">
                    <h3 className="text-muted-foreground text-gray-500">Total Row Material</h3>
                    <p className="text-primary text-2xl mt-10 text-[rgba(78,189,214,255)]">600 T</p>
                </div>
                <div className="bg-card p-4 rounded-lg shadow">
                    <h3 className="text-muted-foreground text-gray-500">Total Packaging</h3>
                    <p className="text-primary text-2xl mt-10 text-[rgba(78,189,214,255)]">500</p>
                </div>
                <div className="bg-card p-4 rounded-lg shadow">
                    <h3 className="text-muted-foreground text-gray-500">Total Packaging Out</h3>
                    <p className="text-primary text-2xl mt-10 text-[rgba(78,189,214,255)]">5</p>
                </div>
                <div className="bg-card p-4 rounded-lg  shadow">
                    <h3 className="text-muted-foreground text-gray-500">Total Row Materials Out</h3>
                    <p className="text-primary text-2xl mt-10 text-[rgba(78,189,214,255)]">2</p>
                </div>
            </div>
            <button
                className="mb-4 px-4 py-2 text-sm bg-[rgba(78,189,214,255)] text-white rounded-lg hover:bg-primary/80">
                <div className='flex items-center'>
                    <span className="mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><g fill="#fff"><path d="M5 11a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2z"></path><path d="M9 5a1 1 0 0 1 2 0v10a1 1 0 1 1-2 0z"></path></g></svg>
                    </span>
                    Stock In
                </div>
            </button>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border rounded-lg text-sm">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 font-normal border">Check</th>
                            <th className="px-4 py-2 font-normal border">Supplier</th>
                            <th className="px-4 py-2 font-normal border">Item</th>
                            <th className="px-4 py-2 font-normal border">Type</th>
                            <th className="px-4 py-2 font-normal border">Quantity</th>
                            <th className="px-4 py-2 font-normal border">Date</th>
                            <th className="px-4 py-2 font-normal border">Plaque</th>
                            <th className="px-4 py-2 font-normal border">Comment</th>
                            <th className="px-4 py-2 font-normal border">Batch</th>
                            <th className="px-4 py-2 font-normal border">Date</th>
                            <th className="px-4 py-2 font-normal border">Edit</th>
                        </tr>
                    </thead>
                    <tbody>
                    
                        <tr className='text-sm font-normal'>
                        <td className="px-4 py-2 text-center border"><input type="checkbox" /></td>
                        <td className="px-4 py-2 text-center border">{stockIn.id}</td>
                        <td className="px-4 py-2 text-center border">{stockIn.item.supplier_id}</td>
                        <td className="px-4 py-2 text-center border">{stockIn.item.name}</td>
                        <td className="px-4 py-2 text-center border">{stockIn.type}</td>
                        <td className="px-4 py-2 text-center border">{stockIn.quantity}</td>
                        <td className="px-4 py-2 text-center border">{stockIn.date}</td>
                        <td className="px-4 py-2 text-center border">{stockIn.plaque}</td>
                        <td className="px-4 py-2 text-center border">{stockIn.comment}</td>
                        <td className="px-4 py-2 text-center border">{stockIn.batch}</td>
                        <td className="px-4 py-2 text-center border"><svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#4d5456" d="M16.293 2.293a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414l-13 13A1 1 0 0 1 8 21H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 .293-.707l10-10zM14 7.414l-9 9V19h2.586l9-9zm4 1.172L19.586 7L17 4.414L15.414 6z"></path></svg></td>
                    </tr>

                    ))}
                        

                    </tbody>
                </table>
            </div>
        </div>
  )
}

export default StockOut