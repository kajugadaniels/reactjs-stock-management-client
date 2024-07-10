import React from 'react'
import { Outlet } from 'react-router-dom'
import { LoginHeader } from '../components'

const LoginLayout = () => {
    return (
        <div>
            <LoginHeader />
            {/* LoginLayout */}
            <Outlet />
        </div>
    )
}

export default LoginLayout