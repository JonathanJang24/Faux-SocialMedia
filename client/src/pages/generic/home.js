import {React} from 'react'
import '../../styles/generic/homeStyle.css'
import Cookies from 'universal-cookie'
import {Navigate} from 'react-router-dom'

const Home = () => {

    const cookies = new Cookies()

    const currentUser = cookies.get('user')

    return currentUser!==''&&currentUser!==undefined ? <Navigate to="/feed"/> :(
        <>
            <div className="home-banner">
                <h1>Faux Social Media</h1>
                <p>A full stack web app demonstrating CRUD and database management</p>
                <h2>Functionality</h2>
                <p>The web app allows for unique individual account creation and login, where users can post and interact with other user's posts.</p>
                <h2>Tech Stack</h2>
                <ul>
                    <li>Flask</li>
                    <li>React.js</li>
                    <li>MySql</li>
                    <li>Bootstrap</li>
                    <li>HTML5</li>
                    <li>CSS3</li>
                </ul>
            </div>
        </>
    )
}

export default Home