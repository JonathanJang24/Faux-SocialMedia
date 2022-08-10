import {React, useState} from 'react'
import Cookies from 'universal-cookie'

const AddFriend = () => {

    const cookies = new Cookies()

    const currentUser = cookies.get('user')

    const [add, setAdd] = useState("")

    const handleChange = (event) => {
        setAdd(event.target.value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        fetch('/api/add_friend',{
            method:'POST',
            body: JSON.stringify({
                extender: currentUser,
                recipient: add
            }),
            headers:{
                'Content-type':'application/json; charset=UTF-8'
            }
        }).then(response => {
            return response.json()
        }).then(message => {
            console.log(message)
            setAdd("")
        })
    }

    return(
        <form onSubmit={handleSubmit}>
            <label>Username:
                <input value={add} onChange={handleChange} type="text"/>
            </label>
            <input className="btn btn-primary" type="submit"/>
        </form>
    )
}

export default AddFriend