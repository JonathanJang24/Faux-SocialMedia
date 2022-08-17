import React,{useState, useEffect} from 'react'
import Cookies from 'universal-cookie'
import {Navigate, useNavigate} from 'react-router-dom'
import Post from './components/post.js'
import '../../styles/user-specific/account.css'
import profile_pic from '../../images/default-profile-pic.png'

const UserInfo = () => {

    const navigate = useNavigate()

    const cookies = new Cookies()

    const currentUser = cookies.get('user')

    const [userInfo, setUserInfo] = useState({})

    const [userPost, setUserPost] = useState([])

    useEffect(() => {
        fetch(`/api/user_info/${currentUser}`)
        .then(response => {
            return response.json()
        }).then(data => {
            setUserInfo(data[0])
        })
        fetch(`/api/user_post/${currentUser}`)
            .then(response => {
                return response.json()
            }).then(data => {
                setUserPost(data)
            })
    },[])

    const handleLogout = () => {
        cookies.set('user','')
        navigate('/login')
        navigate(0)
    }

    return currentUser===''||currentUser===undefined ? <Navigate to="/login"/> : (
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

                <button style={{row:4, column:2}} className="btn btn-primary logout-btn" onClick={handleLogout}>Logout</button>
            </div>
            </div>

            {userPost.map(post => {
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

export default UserInfo