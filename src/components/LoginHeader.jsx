import React from 'react'
import { Icon } from '@iconify/react';

function LoginHeader() {
    return (
        <div className="flex items-center justify-between p-4 border-b border-border bg-background">
            <div className="flex items-center">
                <img src="images/logo.jpeg" alt="company-logo" className="mr-2 w-16 h-16 rounded-full"  />
                <span className="text-lg font-semibold text-foreground">Jabana Industry Management System</span>
            </div>
            <div className="flex items-center space-x-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="-2 -2 24 24"><path fill="#424955" d="M2.252 8A8.014 8.014 0 0 0 2 10c0 .69.088 1.36.252 2H5.1a19.83 19.83 0 0 1 0-4zm.818-2h2.346c.266-1.217.65-2.307 1.121-3.214A8.035 8.035 0 0 0 3.07 6m14.678 2H14.9a19.83 19.83 0 0 1 0 4h2.848a8.047 8.047 0 0 0 0-4m-.818-2a8.035 8.035 0 0 0-3.467-3.214c.472.907.855 1.997 1.121 3.214zM7.112 8A17.763 17.763 0 0 0 7 10c0 .685.038 1.355.112 2h5.776a17.763 17.763 0 0 0 0-4zm.358-2h5.06a10.758 10.758 0 0 0-.783-2.177C11.119 2.568 10.447 2 10 2c-.448 0-1.119.568-1.747 1.823c-.315.632-.58 1.367-.783 2.177m-4.4 8a8.035 8.035 0 0 0 3.467 3.214c-.472-.907-.855-1.997-1.121-3.214zm13.86 0h-2.346c-.266 1.217-.65 2.307-1.121 3.214A8.035 8.035 0 0 0 16.93 14m-9.46 0c.203.81.468 1.545.783 2.177C8.881 17.432 9.553 18 10 18c.448 0 1.119-.568 1.747-1.823c.315-.632.58-1.367.783-2.177zM10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10s-4.477 10-10 10"></path></svg>
            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 16 16"><path fill="#424955" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m5-1.5h2a.5.5 0 0 1 .5-.5h.646a.382.382 0 0 1 .17.724L7 7.382V9h2v-.382l.211-.106A2.382 2.382 0 0 0 8.146 4H7.5A2.5 2.5 0 0 0 5 6.5M8 12a1 1 0 1 0 0-2a1 1 0 0 0 0 2"></path></svg>
            </div>
        </div>
    )
}

export default LoginHeader