import {React} from 'react'
import '../../../styles/user-specific/post.css'

const Post = (props) => {
    return(
        <div className="post-card container ">
            <div className="row">
                <h5 className="col">{props.user}</h5>
                <h5 className="col">{props.date}</h5>
            </div>
            <div className="row justify-content-center">
                <h3>{props.title}</h3>
            </div>
            <div className="row justify-content-center">
                <p>{props.content}</p>
            </div>
            <div className="row align-items-center">
                <p className="col-2">{props.likes}</p>
                <p className="col-3">{props.dislikes}</p>
            </div>            
        </div>
    )
}

export default Post