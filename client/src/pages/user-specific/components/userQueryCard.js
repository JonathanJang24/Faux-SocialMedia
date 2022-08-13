import {React, useState} from 'react'
import Cookies from 'universal-cookie'
import "../../../styles/user-specific/query-card.css"
import {FaCheck} from 'react-icons/fa'

const UserQueryCard = (props) => {

    const cookies = new Cookies()

    const currentUser = cookies.get('user')

    const addUser = props.username

    const updateQuery = props.updateQuery

    const addFriend = (event) => {

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
            updateQuery()
        })
    }

    const remFriend = (event) => {
        fetch('/api/rem_friend',{
            method:'POST',
            body: JSON.stringify({
                extender: currentUser,
                recipient:addUser
            }),
            headers:{
                'Content-type':'application/json; charset=UTF-8'
            }
        }).then(response => {
            return response.json()
        }).then(message=>{
            console.log(message)
            updateQuery()
        })
    }

    return (
        <>
            <div className="query-card">
                <p className="query-card-username query-card-text">{props.username}</p>
                <p className="query-card-name query-card-text">{props.firstname} {props.lastname}</p>
                <p className="query-card-text">Followers: {props.followers}</p>
                <p className="query-card-text">Following: {props.following}</p>
                {props.isFollowing ? <button onClick={remFriend} className="friended-btn btn btn-primary"><FaCheck/> Friended</button> :<button className="btn btn-primary add-friend-btn" onClick={addFriend}>Add Friend</button> }
                {props.isFollower ? <p className="query-card-text">You're being followed by them!</p> : <p></p>}
            </div>
        </>
    )

}

export default UserQueryCard