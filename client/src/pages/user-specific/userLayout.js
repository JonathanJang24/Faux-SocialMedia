import {React} from 'react'
import {Outlet, Link} from 'react-router-dom'

const UserLayout = () => {
    return(
        <>
            <h1>Hello</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/feed">Home</Link>
                    </li>
                    <li>
                        <Link to="/account">About Me</Link>
                    </li>
                </ul>
            </nav>
            <Outlet/>
        </>
    )
}

export default UserLayout