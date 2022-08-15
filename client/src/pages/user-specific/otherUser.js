import React,{useEffect,useState} from 'react'
import {useParams} from 'react-router-dom'

const OtherUser = () => {

    const {username} = useParams()
    return (
        <>
            <h1>Say hi to {username}</h1>
        </>
    )
}

export default OtherUser