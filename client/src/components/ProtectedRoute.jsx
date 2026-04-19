import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'
import Loader from './Loader'

const ProtectedRoute = () => {
    const { token, loading } = useSelector(state => state.auth)

    if (loading) {
        return <Loader />
    }

    if (!token) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
