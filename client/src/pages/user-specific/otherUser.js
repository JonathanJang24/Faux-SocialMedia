import React,{useEffect,useState} from 'react'
import {useParams} from 'react-router-dom'
import Cookies from 'universal-cookie'
import Post from './components/post.js'
import profile_pic from '../../images/default-profile-pic.png'

const OtherUser = () => {

    const cookies = new Cookies()

    const {username} = useParams()

    const [userInfo, setInfo] = useState({})

    const [posts, setPosts] = useState([])

    const currentUser = cookies.get('user')

    useEffect(() => {
        fetch(`/api/user_info/${username}`)
        .then(response => {
            return response.json()
        }).then(data => {
            console.log(data)
            setInfo(data[0])
        })
        fetch(`/api/user_post/${username}`)
        .then(response => {
            return response.json()
        }).then(data => {
            setPosts(data)
        })
    },[])

    return currentUser===''||currentUser===undefined ? 
        <>
            <h1>Please login to view user profiles.</h1>
            <a href="/login">Go to Login</a>
        </>
    
    :(
        <>
            <div className="account-container">
        <h1 className="text-center">User information</h1>
            <div className="account-card">
                <img src={profile_pic} className="user-pic" style={{row:1, column:1}} alt="profile"/>
                <h3 className="text-center user-info-text" style={{row:1, column:2, fontSize:24+"px"}}>Username: {userInfo['username']}</h3>
                <h3 className="text-center user-info-text" style={{row:2, column:1}}>Name: {userInfo['first']} {userInfo['last']}</h3>
                <h3 className="text-center user-info-text" style={{row:2, column:2}}>Following: {userInfo['following']}</h3>
                <h3 className="text-center user-info-text" style={{row:3, column:1}}>Email: {userInfo['email']}</h3>
                <h3 className="text-center user-info-text" style={{row:3, column:2}}>Followers: {userInfo['followers']}</h3>
                <h3 className="text-center user-info-text" style={{row:4, column:1}}>Birthday: {userInfo['birthday']}</h3>
            </div>
            </div>

            {posts.map(post => {
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

export default OtherUser