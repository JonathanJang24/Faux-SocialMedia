import {React, useEffect, useState} from 'react'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom'

const UserFeed = () => {

    const navigate = useNavigate()

    const cookies = new Cookies()

    const currentUser = cookies.get('user')

    const [feed, setFeed] = useState()

    useEffect(() => {
        fetch(`/api/feed/${currentUser}`).then(response => {
            return response.json()
        }).then(message => {
            
        })
    })

    return (
        <>
            <h1>Feed</h1>
        </>
    )
}

export default UserFeed