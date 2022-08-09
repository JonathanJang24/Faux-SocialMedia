import {React, useState, useEffect} from 'react'
import Cookies from 'universal-cookie'
import {Navigate, useNavigate} from 'react-router-dom'

const UserInfo = () => {

    const navigate = useNavigate()

    const cookies = new Cookies()

    const currentUser = cookies.get('user')

    const handleLogout = () => {
        cookies.set('user','')
        navigate('/login')
        navigate(0)
    }

    return currentUser===''||currentUser===undefined ? <Navigate to="/login"/> : (
        <>
            <h1>User information</h1>
            <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
        </>
    )
}

export default UserInfo