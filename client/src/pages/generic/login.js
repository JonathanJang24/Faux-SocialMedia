import {React, useState} from 'react'
import '../../styles/generic/loginStyle.css'

const Login = () => {

    const [loginInfo, setLoginInfo] = useState({'username':'','password':''})

    const handleFormChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setLoginInfo(values => ({...values, [name]:value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        fetch('/api/login',{
            method: 'POST',
            body: JSON.stringify({
                username:loginInfo['username'],
                password:loginInfo['password']
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

    return(
        <>
            <h1>Login form</h1>
            <form onSubmit={handleSubmit}>
                <label>Username:
                    <input type="text" name="username" value={loginInfo['username']} onChange={handleFormChange} required/>
                </label>
                <label>Password:
                    <input type="password" name="password" value={loginInfo['password']} onChange={handleFormChange} required/>
                </label>
                <input type="submit" value="Login"/>
            </form>
        </>
    )
}

export default Login