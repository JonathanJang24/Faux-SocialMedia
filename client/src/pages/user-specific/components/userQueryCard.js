import {React, useState} from 'react'
import Cookies from 'universal-cookie'

const UserQueryCard = (props) => {

    const cookies = new Cookies()

    const currentUser = cookies.get('user')

    const addUser = props.username

    const addFriend = (event) => {
        event.preventDefault()
        fetch('/api/add_friend',{
            method:'POST',
            body: JSON.stringify({
                extender: currentUser,
                recipient: addUser
            }),
            headers:{
                'Content-type':'application/json; charset=UTF-8'
            }
        }).then(response => {
            return response.json()
        }).then(message => {
            console.log(message)
        })
    }

    return (
        <>
            <p>{props.username}</p>
            <button onClick={addFriend}>Add Friend</button>
        </>
    )

}

export default UserQueryCard