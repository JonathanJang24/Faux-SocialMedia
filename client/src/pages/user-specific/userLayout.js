import {React} from 'react'
import {Outlet, Link} from 'react-router-dom'

const UserLayout = () => {
    return(
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link className="nav-link link-class" to="/feed">Feed</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link link-class" to="/account">My Profile</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link link-class" to="/add-friend">Add Friend</Link>
                    </li>
                </ul>
            </nav>
            <Outlet/>
        </>
    )
}

export default UserLayout