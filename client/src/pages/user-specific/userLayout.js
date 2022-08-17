import React,{useEffect,useState} from 'react'
import {Outlet, Link} from 'react-router-dom'

const UserLayout = () => {

    const [users, setUsers] = useState([])

    useEffect(() => {

        fetch('/api/usernames')
        .then(response => {
          return response.json()
        }).then(data => {
          setUsers(data)
        })
      },[])

    return(
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link className="nav-link link-class" to="/feed">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link link-class" to="/account">My Profile</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link link-class" to="/add-friend">Search</Link>
                    </li>
                    {users.map(user => (
                        <li key={user.user_id} className="nav-item">
                            <Link className="nav-link link-class" to={'/user/'+user.username}/>
                        </li>
                    ))}
                </ul>
            </nav>
            <Outlet/>
        </>
    )
}

export default UserLayout