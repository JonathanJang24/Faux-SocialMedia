import React, {useState} from 'react'
import '../../styles/generic/loginStyle.css'
import {Navigate, useNavigate} from 'react-router-dom'
import Cookies from 'universal-cookie'

const Login = () => {

    const cookies = new Cookies()

    const currentUser = cookies.get('user')

    const navigate = useNavigate()

    const [loginInfo, setLoginInfo] = useState({'username':'','password':''})

    const [error, setError] = useState("")



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
            if(message[200]){
                cookies.set('user',loginInfo['username'])
                navigate("/feed")
                navigate(0)
            }
            else if(message[401]){
                setError("Username not found")
            }
            else if(message[402]){
                setError("Incorrect password")
            }
        })
    }

    return currentUser!==''&&currentUser!==undefined ? <Navigate to="/feed"/>: (
        <>
            <div className="login-container">
                <div className="login-content">
                    <h1 id="card-title">Login</h1>
                        <form onSubmit={handleSubmit}>
                            <label>Username:
                                <input type="text" name="username" value={loginInfo['username']} onChange={handleFormChange} required/>
                            </label>
                            <label>Password:
                                <input type="password" name="password" value={loginInfo['password']} onChange={handleFormChange} required/>
                            </label>
                            <input className="login-button" type="submit" value="Login"/>
                        </form>
                        <p className="login-signup">Don't have an account? <a href="/signup">Signup here</a></p>
                        <p className="form-error">{error}</p>
                </div>
            </div>
        </>
    )
}

export default Login