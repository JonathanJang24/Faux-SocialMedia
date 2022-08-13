import {React,useState} from 'react'
import '../../../styles/user-specific/create-post.css'
import Cookies from 'universal-cookie'

const CreatePost = ({update}) => {

    const cookies = new Cookies()

    const currUser = cookies.get('user')

    const [postData, setPostData] = useState({'title':'','content':''})

    const handleChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setPostData(values => ({...values, [name]:value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        fetch('/api/create_post',{
            method:'POST',
            body: JSON.stringify({
                user: currUser,
                title: postData['title'],
                content: postData['content']
            }),
            headers:{
                'Content-type': 'applications/json; charset=UTF-8'
            }
        }).then(response => {
            return response.json()
        }).then(message => {
            console.log(message)
            update()
            setPostData({'title':'','content':''})
        })
    }

    return (
        <>
            <div className="create-post-card">
                <h3>Write what's on your mind!</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="create-post-title">Title:</label>
                        <input type="text" name="title" className="form-control" value={postData['title']}  onChange={handleChange} placeholder="Post Title" id="create-post-title"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="create-post-content">Your thoughts...</label>
                        <input type="text" name="content" value={postData['content']} onChange={handleChange}className="form-control" placeholder="What's on your mind?" id="create-post-content"/>
                    </div>
                    <input className="btn btn-primary" type="submit"/>
                </form>
            </div>
        </>
    )
}

export default CreatePost