import {React} from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/generic/home.js'
import Login from './pages/generic/signup.js'
import Signup from './pages/generic/login.js'
import LoginLayout from './pages/generic/loginLayout.js'

function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>

          <Route path="/" element={<LoginLayout/>}>
            <Route index element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/signup" element={<Signup/>}/>
          </Route>

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
