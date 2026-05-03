import React, { useState, useEffect } from 'react';
import './List.css';
import axios from "axios";
import { toast } from "react-toastify";

const List = () => {
  const url = "http://localhost:4000"
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchList = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${url}/api/food/list`)
      if (response.data.success) {
        setList(response.data.data)
      } else {
        toast.error("Error fetching data")
      }
    } catch (error) {
      toast.error("Server Error")
    }
    setLoading(false)
  }

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchList()
      } else {
        toast.error("Error deleting item")
      }
    } catch (error) {
      toast.error("Server Error")
    }
  }

  useEffect(() => { fetchList() }, [])

  return (
    <div className='list-page'>

      <div className="list-header">
        <div>
          <h1 className="page-title">FOOD ITEMS</h1>
          <p className="page-sub">{list.length} items in your menu</p>
        </div>
        <button className="refresh-btn" onClick={fetchList}>⟳ Refresh</button>
      </div>

      {loading ? (
        <div className="list-loading">
          <div className="spinner"></div>
          <p>Loading items...</p>
        </div>
      ) : list.length === 0 ? (
        <div className="list-empty">
          <div>🍽</div>
          <h3>No items found</h3>
          <p>Add some food items from the Add Items page</p>
        </div>
      ) : (
        <div className="list-table">
          <div className="list-head">
            <span>IMAGE</span>
            <span>NAME</span>
            <span>CATEGORY</span>
            <span>PRICE</span>
            <span>ACTION</span>
          </div>

          {list.map((item, index) => (
            <div key={index} className='list-row'>
              <div className="list-glow-line"></div>
              <div className="item-img-wrap">
                <img src={`${url}/images/${item.image}`} alt={item.name} />
              </div>
              <p className="item-name">{item.name}</p>
              <span className="item-category">{item.category}</span>
              <p className="item-price">₹{item.price}</p>
              <button className="delete-btn" onClick={() => removeFood(item._id)}>
                🗑 Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default List
