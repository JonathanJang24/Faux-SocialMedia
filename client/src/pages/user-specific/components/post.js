import React,{useEffect, useState} from 'react'
import '../../../styles/user-specific/post.css'
import Cookies from 'universal-cookie'
import Comment from '../../user-specific/components/comment.js'
import {FaTrash, FaThumbsDown, FaThumbsUp} from 'react-icons/fa'

const Post = (props) => {

    const cookies = new Cookies()

    const currentUser = cookies.get('user')

    const [comment, setComment] = useState("")

    const [commented, setCommented] = useState([])

    const updateFeed = props.update

    useEffect(() => {
        fetch(`/api/get_comments/${props.id}`)
        .then(response => {
            return response.json()
        }).then(data => {
            setCommented(data)
        })
    },[])

    const updateComments = () => {
        fetch(`/api/get_comments/${props.id}`)
        .then(response => {
            return response.json()
        }).then(data => {
            setCommented(data)
        })
    }

    const changeComment = (event) => {
        setComment(event.target.value)
    }

    const postComment = (event) => {
        event.preventDefault()
        fetch("/api/comment_post",{
            method:'POST',
            body:JSON.stringify({
                user:currentUser,
                content:comment,
                id:props.id
            }),
            headers:{
                'Content-type':'application/json; charset=UTF-8'
            }
        }).then(response => {
            return response.json()
        })
        .then(message => {
            console.log(message)
            updateComments()
        })
        setComment("")
        updateFeed()
    }

    const likePost = (event) => {
        event.preventDefault()
        console.log("liked")
    }

    const dislikePost = (event) => {
        event.preventDefault()
        console.log("disliked")
    }

    const deletePost = (event) => {
        event.preventDefault()
        const confirmBox = window.confirm(
            "Do you really want to delete the post?"
        )
        if(confirmBox===true){
            fetch('/api/rem_post',{
                method: 'POST',
                body: JSON.stringify({
                    post_id:props.id
                }),
                headers:{
                    'Content-type':'application/json; charset=UTF-8'
                }
            }).then(response => {
                return response.json()
            }).then(message => {
                console.log(message)
                updateFeed()
            })
        }
    }

    return(
        <div className="post-card container ">
            <div className="row justify-content-center">
                <h3>{props.title} {props.user===currentUser ? <FaTrash className="trash-icon-post" onClick={deletePost}/>: <></>}</h3>
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
                {commented.map(c => {
                    return(
                        <Comment
                        key={c.comment_id}
                        id = {c.comment_id}
                        user={c.user}
                        update = {updateComments}
                        content={c.content}
                        />
                    )
                })}
        </div>
    )
}

export default Post