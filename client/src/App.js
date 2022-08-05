import {React} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/generic/home.js'
import Login from './pages/generic/login.js'
import Signup from './pages/generic/signup.js'
import LoginLayout from './pages/generic/loginLayout.js'
import UserInfo from './pages/user-specific/userInfo.js'
import UserFeed from './pages/user-specific/userFeed.js'
import UserLayout from './pages/user-specific/userLayout.js'

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>

          <Route path="/" element={<LoginLayout/>}>
            <Route index element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/feed" element={<UserFeed/>}/>
            <Route path="/account" element={<UserInfo/>}/>
          </Route>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
