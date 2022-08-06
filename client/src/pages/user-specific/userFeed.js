import {React, useEffect, useState} from 'react'
import Cookies from 'universal-cookie'
import { Navigate } from 'react-router-dom'
import Post from './components/post.js'
import CreatePost from './components/createPost.js'
import "../../styles/user-specific/feed.css"

const UserFeed = () => {


    const cookies = new Cookies()

    const currentUser = cookies.get('user')

    const [feed, setFeed] = useState([])

    useEffect(() => {   
        fetch(`/api/feed/${currentUser}`)
        .then(response => {
            return response.json()
        }).then(data => {
            console.log(data)
            // setFeed(data)
        })
    },[])

    return currentUser==='' ? <Navigate to="/login"/> : (
        <>
            <h1>Feed</h1>

            <CreatePost/>

            {feed.map(post => {
                return(
                    <Post/>
                )
            })}
        </>
    )
}

export default UserFeed