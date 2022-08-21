import React,{useState} from 'react'
import '../../../styles/user-specific/post.css'
import Cookies from 'universal-cookie'
import {FaThumbsDown, FaThumbsUp} from 'react-icons/fa'

const Post = (props) => {

    const cookies = new Cookies()

    const currentUser = cookies.get('user')

    const [comment, setComment] = useState("")

    const changeComment = (event) => {
        setComment(event.target.value)
    }

    const postComment = (event) => {
        event.preventDefault()
        console.log(comment)
        setComment("")
    }

    const likePost = (event) => {
        event.preventDefault()
        console.log("liked")
    }

    const dislikePost = (event) => {
        event.preventDefault()
        console.log("disliked")
    }

    return(
        <div className="post-card container ">
            <div className="row justify-content-center">
                <h3>{props.title}</h3>
            </div>
            <div className="row">
                {props.user===currentUser ? <p className="col">{props.user}</p> : <a href={"/user/"+props.user} className="col">{props.user}</a>}
                <p className="col">{props.date}</p>
            </div>
            <div className="row justify-content-center">
                <p>{props.content}</p>
            </div>
            <div className="row d-flex p-2 flex-row ">
                <FaThumbsUp onClick={likePost} className="like-btn d-inline col-1"/>
                <p className="col-1 d-inline">{props.likes}</p>
                <FaThumbsDown onClick={dislikePost} className="dislike-btn col-1 d-inline"/>
                <p className="col-1 d-inline ">{props.dislikes}</p>
            </div>    
                <form className="row d-flex p-2 flex-row" onSubmit={postComment}>
                    <input className="col-9 d-inline" type="text" value={comment} onChange={changeComment} placeholder="comment"/>
                    <input className="col-2 btn btn-primary d-inline" type="submit" value="Comment"/>
                </form>      
        </div>
    )
}

export default Post