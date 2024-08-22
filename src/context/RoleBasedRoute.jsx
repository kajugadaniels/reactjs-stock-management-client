import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ element: Element, allowedRoles, userRole, ...rest }) => {
    if (!allowedRoles.includes(userRole)) {
        // Redirect to a "Not Authorized" page or dashboard
        return <Navigate to="/dashboard" replace />;
    }

    return <Element {...rest} />;
};

export default RoleBasedRoute;