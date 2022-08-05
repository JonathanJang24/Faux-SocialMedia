import {React} from 'react'
import {Outlet, Link} from 'react-router-dom'

const LoginLayout = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                        <Link className="nav-link link-class" to="/">Home</Link>
                    </li>
                    <li className="nav-item"> 
                        <Link className="nav-link link-class" to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link link-class" to="/signup">Signup</Link>
                    </li>
                </ul>
            </nav>
            <Outlet/>
        </>
    )
}

export default LoginLayout