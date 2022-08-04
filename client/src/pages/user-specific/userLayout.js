import {React} from 'react'
import {Outlet, Link} from 'react-router-dom'

const UserLayout = () => {
    return(
        <>
            <nav>
                <ul>
                    <li>
                        <Link>Home</Link>
                    </li>
                    <li>
                        <Link>About Me</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}