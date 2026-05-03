import React, { useEffect, useState } from 'react'
import './Orders.css'
import axios from 'axios'
import { toast } from 'react-toastify'

const Orders = () => {
  const url = "http://localhost:4000"
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${url}/api/order/list`)
      if (res.data.success) {
        setOrders(res.data.data.reverse())
      } else {
        toast.error('Failed to fetch orders')
      }
    } catch (err) {
      toast.error('Server error!')
    }
    setLoading(false)
  }

  const updateStatus = async (orderId, status) => {
    try {
      const res = await axios.post(`${url}/api/order/status`, { orderId, status })
      if (res.data.success) {
        toast.success('Status updated!')
        fetchOrders()
      }
    } catch (err) {
      toast.error('Update failed!')
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0)

  const getStatusClass = (status) => {
    if (status === 'Food Processing') return 'status-processing'
    if (status === 'Out for Delivery') return 'status-delivery'
    if (status === 'Delivered') return 'status-delivered'
    return 'status-processing'
  }

  return (
    <div className='orders-page'>

      {/* Header */}
      <div className="orders-header">
        <div>
          <h1 className="page-title">ORDERS</h1>
          <p className="page-sub">Manage and track all customer orders</p>
        </div>
        <button className="refresh-btn" onClick={fetchOrders}>⟳ Refresh</button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card red">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <strong>{orders.length}</strong>
            <span>Total Orders</span>
          </div>
          <div className="stat-glow red-glow"></div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-icon">🍳</div>
          <div className="stat-info">
            <strong>{orders.filter(o => o.status === 'Food Processing').length}</strong>
            <span>Processing</span>
          </div>
          <div className="stat-glow yellow-glow"></div>
        </div>
        <div className="stat-card blue">
          <div className="stat-icon">🚴</div>
          <div className="stat-info">
            <strong>{orders.filter(o => o.status === 'Out for Delivery').length}</strong>
            <span>Out for Delivery</span>
          </div>
          <div className="stat-glow blue-glow"></div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <strong>{orders.filter(o => o.status === 'Delivered').length}</strong>
            <span>Delivered</span>
          </div>
          <div className="stat-glow green-glow"></div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <strong>₹{totalRevenue}</strong>
            <span>Total Revenue</span>
          </div>
          <div className="stat-glow orange-glow"></div>
        </div>
      </div>

      {/* Orders */}
      {loading ? (
        <div className="orders-loading">
          <div className="spinner"></div>
          <p>Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="orders-empty">
          <div className="empty-icon">🛒</div>
          <h3>No Orders Yet</h3>
          <p>Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div className={`order-card ${getStatusClass(order.status)}-card`} key={order._id}>

              <div className="order-card-glow"></div>

              <div className="order-top">
                <div className="order-id-wrap">
                  <span className="order-hashtag">#</span>
                  <div>
                    <p className="order-num">ORDER {String(index + 1).padStart(3, '0')}</p>
                    <p className="order-date">
                      {new Date(order.date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className={`status-pill ${getStatusClass(order.status)}`}>
                  {order.status === 'Food Processing' && '🍳 Processing'}
                  {order.status === 'Out for Delivery' && '🚴 Out for Delivery'}
                  {order.status === 'Delivered' && '✅ Delivered'}
                </div>
              </div>

              <div className="order-body">

                <div className="order-section">
                  <p className="order-label">ITEMS ORDERED</p>
                  <div className="items-chips">
                    {order.items.map((item, i) => (
                      <span className="item-chip" key={i}>
                        {item.name} × {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="order-section">
                  <p className="order-label">DELIVERY ADDRESS</p>
                  <p className="address-text">
                    <span>{order.address.firstName} {order.address.lastName}</span><br />
                    {order.address.street}<br />
                    {order.address.city && `${order.address.city}, `}
                    {order.address.state} {order.address.zip}<br />
                    📞 {order.address.phone}
                  </p>
                </div>

                <div className="order-section">
                  <p className="order-label">AMOUNT</p>
                  <p className="amount-val">₹{order.amount}</p>
                  <span className={`pay-badge ${order.payment ? 'paid' : 'unpaid'}`}>
                    {order.payment ? '✅ Paid' : '⏳ Pending'}
                  </span>

                  <p className="order-label" style={{marginTop: '16px'}}>UPDATE STATUS</p>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="Food Processing">🍳 Food Processing</option>
                    <option value="Out for Delivery">🚴 Out for Delivery</option>
                    <option value="Delivered">✅ Delivered</option>
                  </select>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
