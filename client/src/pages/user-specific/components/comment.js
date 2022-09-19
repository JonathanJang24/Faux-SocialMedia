import React from 'react'
import Cookies from 'universal-cookie'
import {FaTrash} from 'react-icons/fa'
import '../../../styles/user-specific/comment.css'

const Comment = (props) => {

    const cookies = new Cookies()

    const currentUser = cookies.get('user')

    const updateFeed = props.update

    const deleteComment = () => {
        const confirmBox = window.confirm(
            "Do you really want to delete your comment?"
        )
        if(confirmBox === true){
            fetch('/api/rem_comment',{
                method: 'POST',
                body: JSON.stringify({
                    comment_id: props.id
                }),
                headers:{
                    'Content-type':'application/json; charset=UTF-8'
                }
            }).then(response=> {
                return response.json()
            }).then(message=> {
                console.log(message)

                // This function is not working, and somehow needes to be called from the top level functio of 'user-feed.js'
                updateFeed()
            })
        }
    }

    return (
    <div className="comment-container">
        {/* add more conditions where comments on your own post can be deleted regardless of user*/}
        <p><a href={"/user/"+props.user}>{props.user}</a>: {props.content}</p>
        {props.user===currentUser ? <FaTrash className="trash-icon-comment" onClick={deleteComment}/>: <></>}
    </div>
    )
}

export default Comment;