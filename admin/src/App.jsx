import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './Pages/Add/Add'
import List from './Pages/List/List'
import Orders from './Pages/Orders/Orders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

const App = () => {
  return (
    <div className="admin-app">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="dark"
        toastStyle={{ background: '#16161f', border: '1px solid rgba(255,61,61,0.3)', color: '#f0f0ff' }}
      />
      <Navbar />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Add />} />
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<List />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
