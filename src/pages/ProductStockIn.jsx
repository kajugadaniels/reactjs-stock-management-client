import React from 'react'

const ProductStockIn = () => {
    return (
        <div className="p-4">
            <div className="grid grid-cols-4 gap-4 mb-4 text-gray-500">
                <div className="bg-card p-4 rounded-lg shadow">
                    <h2 className="text-muted-foreground ">Total Packeging Stock</h2>
                    <p className="text-primary m-5  text-2xl text-[#00BDD6]">600 </p>
                </div>
                <div className="bg-card p-4 rounded-lg shadow">
                    <h2 className="text-muted-foreground">Total 5 Kg</h2>
                    <p className="text-primary m-5  text-2xl  text-[#00BDD6]">500 T</p>
                </div>
                <div className="bg-gray-300 p-4 rounded-lg shadow">
                    <h2 className="text-muted-foreground">Total 10 Kg</h2>
                    <p className="text-primary m-5  text-2xl  text-black">400</p>
                </div>
                <div className="bg-card  rounded-lg p-4 shadow bg-[#f9d8c0]">
                    <h2 className="text-muted-foreground ">Total 25 Kg</h2>
                    <p className="text-primary m-5 text-2xl text-black">250</p>
                </div>
            </div>
            <div className='flex gap-10'>
                <button
                    className="mb-4 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-primary/80">
                    <div className='flex items-center'>
                        <span className="mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><g fill="#fff"><path d="M5 11a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2z"></path><path d="M9 5a1 1 0 0 1 2 0v10a1 1 0 1 1-2 0z"></path></g></svg>
                        </span>
                        Product Stock In
                    </div>
                </button>
                <button
                    className="mb-4 px-4 py-2 text-sm bg-green-500 text-black rounded-lg hover:bg-primary/80">
                    <div className='flex items-center'>
                        <span className="mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#0f1b1f" d="M7 22q-.825 0-1.412-.587T5 20t.588-1.412T7 18t1.413.588T9 20t-.587 1.413T7 22m10 0q-.825 0-1.412-.587T15 20t.588-1.412T17 18t1.413.588T19 20t-.587 1.413T17 22M3 4H2q-.425 0-.712-.288T1 3t.288-.712T2 2h1.65q.275 0 .525.15t.375.425L8.525 11h7l3.625-6.5q.125-.25.35-.375T20 4q.575 0 .863.488t.012.987L17.3 11.95q-.275.5-.737.775T15.55 13H8.1L7 15h11q.425 0 .713.288T19 16t-.288.713T18 17H7q-1.125 0-1.713-.975T5.25 14.05L6.6 11.6zm9 5.5q-.425 0-.712-.288T11 8.5t.288-.712T12 7.5t.713.288T13 8.5t-.288.713T12 9.5M12 6q-.425 0-.712-.288T11 5V2q0-.425.288-.712T12 1t.713.288T13 2v3q0 .425-.288.713T12 6"></path></svg>
                        </span>
                        Product Stock In
                    </div>
                </button>
                <button
                    className="mb-4 px-4 py-2 text-sm bg-yellow-500 text-black rounded-lg hover:bg-primary/80">
                    <div className='flex items-center'>
                        <span className="mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="#0f1b1f" d="M7.308 21.116q-.633 0-1.067-.434t-.433-1.066t.433-1.067q.434-.433 1.067-.433t1.066.433t.434 1.067t-.434 1.066t-1.066.434m9.384 0q-.632 0-1.066-.434t-.434-1.066t.434-1.067q.434-.433 1.066-.433t1.067.433q.433.434.433 1.067q0 .632-.433 1.066q-.434.434-1.067.434M2 3.5v-1h2.448l4.096 8.616h7l3.67-6.616h1.14l-4.225 7.616H8.1l-1.639 3h11.731v1H4.741l2.744-4.9L3.808 3.5zm9.5 3v-5h1v5zm-.115 3V8.27h1.23V9.5z"></path></svg>
                        </span>
                        Product Stock Out
                    </div>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full p-10 bg-white border border-zinc-200">
                    <thead>
                        <tr>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Check</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Stock In Id</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Package Id</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Finished Product</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Packege</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Quantity</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Employee</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">comment</th>
                            <th className="py-2 px-4 border-b bg-slate-100 text-gray-500 text-left">Date</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="px-4 py-2 border-b text-center"><input type="checkbox" /></td>
                            <td className="px-4 py-2 border-b">SI - 001</td>
                            <td className="px-4 py-2 border-b">PK - 001</td>
                            <td className="px-4 py-2 border-b">SN</td>
                            <td className="px-4 py-2 border-b">5 KG</td>
                            <td className="px-4 py-2 border-b">942</td>
                            <td className="px-4 py-2 border-b">Uwimana Jacky</td>
                            <td className="px-4 py-2 border-b">adding comment if any </td>
                            <td className="px-4 py-2 border-b">20/10/2020</td>



                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductStockIn