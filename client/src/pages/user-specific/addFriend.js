import React,{useState} from 'react'
import Cookies from 'universal-cookie'
import UserQueryCard from './components/userQueryCard'

const AddFriend = () => {

    const cookies = new Cookies()

    const currentUser = cookies.get('user')

    const [query, setQuery] = useState("")
    const [userRes, setUserRes] = useState([])

    const handleChange = (event) => {
        setQuery(event.target.value)

        fetch(`/api/find_users/${currentUser}/_${event.target.value}`).then(
            response => {
                if(response.ok){
                    return response.json()
                }
        }).then(message => {
            if(message[400]){
                setUserRes([])
            }
            else{
                setUserRes(message)
            }     
        })
    }

    const updateQuery = () => {
        fetch(`/api/find_users/${currentUser}/_${query}`).then(
            response => {
                if(response.ok){
                    return response.json()
                }
        }).then(message => {
            if(message[400]){
                setUserRes([])
            }
            else{   
                setUserRes(message)
            }     
        })
    }

    return(
        <>
            <label>Username:
                <input value={query} onChange={handleChange} type="text"/>
            </label>

            {userRes.map(user=> {
                return(
                    <UserQueryCard
                        key={user.user_id}
                        username={user.username}
                        firstname={user.first}
                        lastname={user.last}
                        followers={user.recipient}
                        following={user.extender}
                        isFollower={user.isFollowed}
                        isFollowing={user.isFollowing}
                        updateQuery={updateQuery}
                    />
                )
            })}
        </>
    )
}

export default AddFriend