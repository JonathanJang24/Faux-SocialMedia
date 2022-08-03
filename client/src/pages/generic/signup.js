import {React, useState} from 'react'

const Signup = () => {

    const [signupInfo,setSignupInfo] = useState({'username':'','password':'','password_check':'','email':'','first_name':'','last_name':'','birthdate':''})

    const handleFormChange = (event) => {
        const name = event.target.name
        const value = event.target.value
        setSignupInfo(values => ({...values, [name]:value}))
    }

    const handleFormSubmit = (event) => {
        event.preventDefault()
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
        })
    }

    // check for matching pasword and verification passwd
    return (
        <>
            <h1>Signup</h1>
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
                <input type="submit" value="Signup"/>
            </form>
        </>
    )
}

export default Signup