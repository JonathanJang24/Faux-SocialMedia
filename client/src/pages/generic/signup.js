import {React, useState} from 'react'
import "../../styles/generic/signupStyle.css"
import Cookies from 'universal-cookie'
import {Navigate} from 'react-router-dom'

const Signup = () => {

    const cookies = new Cookies()

    const currentUser = cookies.get('user')

    const [signupInfo,setSignupInfo] = useState({'username':'','password':'','password_check':'','email':'','first_name':'','last_name':'','birthdate':''})
    const [error, setError] = useState(" ")

    const handleFormChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setSignupInfo(values => ({...values, [name]:value}))
    }

    const validate = () => {
        if(typeof signupInfo['password'] !== 'undefined' && typeof signupInfo['password_check']){
            if(signupInfo['password'] !== signupInfo['password_check']){
                setError("Passwords should match")
                return false
            }
        }
        return true
    }

    const handleFormSubmit = (event) => {
        event.preventDefault()

        if(validate()){
            fetch('/api/signup',{
                method: 'POST',
                body: JSON.stringify({
                    username: signupInfo['username'],
                    password: signupInfo['password'],
                    email: signupInfo['email'],
                    first_name: signupInfo['first_name'],
                    last_name: signupInfo['last_name'],
                    birthdate: signupInfo['birthdate']
                }),
                headers:{
                    'Content-type':'application/json; charset=UTF-8'
                }
            }).then(response => {
                return response.json()
            }).then(message => {
                console.log(message)
                if(message[200]){
                    setSignupInfo({'username':'','password':'','password_check':'','email':'','first_name':'','last_name':'','birthdate':''})
                }
                else if(message[400]){
                    setError("User already exists")
                }   
            })
        }
    }

    // check for matching pasword and verification passwd
    return currentUser!==''&&currentUser!==undefined ? <Navigate to="/feed"/> : (
        <>
            <div className="signup-container">
            <div className="login-content">
            <h1 id="card-title">Signup</h1>
            <form onSubmit={handleFormSubmit}>
                <label>Username:
                    <input type="text" name="username" value={signupInfo['username']} onChange={handleFormChange} required/>
                </label>
                <label>Password:
                    <input type="password" name="password" value={signupInfo['password']} onChange={handleFormChange} required/>
                </label>
                <label>Verify password:
                    <input type="password" name="password_check" value={signupInfo['password_check']} onChange={handleFormChange} required/>
                </label>
                <label>Email:
                    <input type="email" name="email" value={signupInfo['email']} onChange={handleFormChange} required/>
                </label>
                <label>First name:
                    <input type="text" name="first_name" value={signupInfo['first_name']} onChange={handleFormChange} required/>
                </label>
                <label>Last name:
                    <input type="text" name="last_name" value={signupInfo['last_name']} onChange={handleFormChange} required/>
                </label>
                <label>Birthdate:
                    <input type="date" name="birthdate" value={signupInfo['birthdate']} onChange={handleFormChange} required/>
                </label>
                <input id="signup-button" type="submit" value="Signup"/>
            </form>
            <p className="login-signup">Already have an account? <a href="/login">Login here</a></p>
            <p className="form-error">{error}</p>
            </div>
            </div>
        </>
    )
}

export default Signup