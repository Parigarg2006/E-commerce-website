import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className='navbar'>
      <div className="navbar-logo">
        <span className="logo-icon">🍅</span>
        <span className="logo-text">TOMATO</span>
        <span className="logo-badge">ADMIN</span>
      </div>
      <div className="navbar-center">
        <div className="nav-status">
          <span className="pulse-dot"></span>
          <span>System Online</span>
        </div>
      </div>
      <div className="navbar-right">
        <div className="nav-time" id="nav-time"></div>
        <div className="avatar">P</div>
      </div>
    </nav>
  )
}

export default Navbar
