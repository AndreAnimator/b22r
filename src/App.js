import React from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'

import Login from './components/login.component'
import SignUp from './components/signup.component'
import UserDetails from './components/userDetails'
import Reset from './components/reset'
import UserHome from './components/userHome'
import ProtectedRoute from './components/ProtectedRote'
import AdminHome from './components/adminHome'
import UpdateUser from './components/updateUser'
import UpdateEvent from './components/updateEvent'
import RegisterEvent from './components/registerEvent'
import EventDetails from './components/eventDetails'
import Home from './components/home'

function App() {
  const isLoggedIn = window.localStorage.getItem("loggedIn");
  const userType = window.localStorage.getItem("userType");
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container">
            <Link className="navbar-brand" to={'/sign-in'}>
              positronX
            </Link>
            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
              <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                  <Link className="nav-link" to={'/home'}>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-in'}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-up'}>
                    Sign up
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/userDetails'}>
                    Details
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              {/* unauthorized route */}
              {!isLoggedIn && (
                <>
                  <Route path="/" element={<Login />} />
                  <Route path="/home" element={<Home/>} />
                  <Route path="/sign-in" element={<Login />} />
                  <Route path="/sign-up" element={<SignUp />} />
                  <Route path="/reset" element={<Reset />} />
                  <Route path="/eventDetails" element={<EventDetails />} />
                </>
              )}

              {/* ProtectedRoutes */}
              <Route element={<ProtectedRoute/>}>
              <Route path="/home" element={<Home/>} />
              <Route path="/sign-in" element={<Navigate to="/"/>} />
              <Route path="/sign-up" element={<Navigate to="/"/>} />
              <Route path="/reset" element={<Navigate to="/"/>} />
              <Route path="/registerEvent" element={<RegisterEvent/>} />
              <Route path="/updateEvent" element={<UpdateEvent/>} />
              <Route path="/eventDetails" element={<EventDetails/>} />
              
              {
                userType!="Admin"?(<>
                  <Route path="/" element={<Navigate to="/home"/>} />
                  <Route path="/home" element={<Home/>} />
                  <Route path="/userDetails" element={<UserDetails />} />
                  <Route path="/updateUser" element={<UpdateUser/>} />
                  <Route path="/userHome" element={<UserHome/>} />
                  <Route path="/adminHome" element={<Navigate to="/"/>} />
                  <Route path="/registerEvent" element={<Navigate to="/"/>} />
                  <Route path="/updateEvent" element={<Navigate to="/"/>} />
                  <Route path="/eventDetails" element={<EventDetails/>} />
                </>):(
                  <>
                    <Route path="/" element={<Navigate to="/adminHome"/>} />
                    <Route path="/home" element={<Home/>} />
                    <Route path="/userDetails" element={<Navigate to="/"/>} />
                    <Route path="/updateUser" element={<Navigate to="/"/>} />
                    <Route path="/userHome" element={<Navigate to="/"/>} />
                    <Route path="/adminHome" element={<AdminHome/>} />
                    <Route path="/registerEvent" element={<RegisterEvent/>} />
                    <Route path="/updateEvent" element={<UpdateEvent/>} />
                    <Route path="/eventDetails" element={<EventDetails/>} />
                  </>
                )
              }
              </Route>
              <Route path="*" element={<Navigate to="/"/>} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
