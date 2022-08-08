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
            setFeed(data)
        })
    },[])

    const updateFeed = () => {
        console.log("clicked")
        fetch(`/api/feed/${currentUser}`).then(response => {
            if(response.ok){
                return response.json()
            }
        }).then(data => {
            console.log(data)
            setFeed(data)
        })
    }

    return currentUser===''||currentUser===undefined ? <Navigate to="/login"/> : (
        <>
            <h1>Feed</h1>

            <CreatePost update={updateFeed}/>

            {feed.map(post => {
                return(
                    <Post 
                    key={post.post_id} 
                    user={post.user}
                    date={post.posted_date}
                    title={post.title}
                    content={post.content}
                    likes={post.likes}
                    dislikes={post.dislikes}
                    />
                )
            })}
        </>
    )
}

export default UserFeed