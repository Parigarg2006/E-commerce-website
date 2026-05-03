import React from 'react'
import "./Sidebar.css"
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-menu">
        <p className="sidebar-label">NAVIGATION</p>

        <NavLink to='/add' className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <span className="s-icon">➕</span>
          <span className="s-text">Add Items</span>
          <span className="s-arrow">›</span>
        </NavLink>

        <NavLink to='/list' className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <span className="s-icon">📋</span>
          <span className="s-text">List Items</span>
          <span className="s-arrow">›</span>
        </NavLink>

        <NavLink to='/orders' className={({ isActive }) => `sidebar-option ${isActive ? 'active' : ''}`}>
          <span className="s-icon">🛒</span>
          <span className="s-text">Orders</span>
          <span className="s-arrow">›</span>
        </NavLink>
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-version">
          <span>🍅</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
