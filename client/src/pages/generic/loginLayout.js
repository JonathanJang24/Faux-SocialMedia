import {React} from 'react'
import {Outlet, Link} from 'react-router-dom'

const LoginLayout = () => {
    return (
        <>
        
            <nav>
                <ul>
                    <li>
                        <Link className="link-class" to="/">Home</Link>
                    </li>
                    <li>
                        <Link className="link-class" to="/login">Login</Link>
                    </li>
                    <li>
                        <Link className="link-class" to="/signup">Signup</Link>
                    </li>
                </ul>
            </nav>
            <Outlet/>
        </>
    )
}

export default LoginLayout