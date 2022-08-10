import {React, useState, useEffect} from 'react'
import Cookies from 'universal-cookie'
import {Navigate, useNavigate} from 'react-router-dom'

const UserInfo = () => {

    const navigate = useNavigate()

    const cookies = new Cookies()

    const currentUser = cookies.get('user')

    const [userInfo, setUserInfo] = useState({})

    useEffect(() => {
        fetch(`/api/user_info/${currentUser}`)
        .then(response => {
            return response.json()
        }).then(data => {
            console.log(data[0])
            setUserInfo(data[0])
        })
    },[])

    const handleLogout = () => {
        cookies.set('user','')
        navigate('/login')
        navigate(0)
    }

    return currentUser===''||currentUser===undefined ? <Navigate to="/login"/> : (
        <>
            <h1>User information</h1>
            <h3>Username: {userInfo['username']}</h3>
            <h3>Name: {userInfo['first']} {userInfo['last']}</h3>
            <h3>Email: {userInfo['email']}</h3>
            <h3>Birthday: {userInfo['birthday']}</h3>

            <button className="btn btn-primary" onClick={handleLogout}>Logout</button>

        </>
    )
}

export default UserInfo