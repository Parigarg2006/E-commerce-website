import React, { useState } from 'react'
import './Add.css'
import { assets } from '../../assets/assets'
import axios from "axios"
import { toast } from 'react-toastify'

const Add = () => {
  const url = "http://localhost:4000"
  const [image, setImage] = useState(false)
  const [data, setData] = useState({
    name: "", description: "", price: "", category: "Salad"
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    let value = event.target.value
    if (name === "price") value = value.replace(/[^0-9]/g, "")
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append("name", data.name)
    formData.append("description", data.description)
    formData.append("price", Number(data.price))
    formData.append("category", data.category)
    formData.append("image", image)
    try {
      const response = await axios.post(`${url}/api/food/add`, formData)
      if (response.data.success) {
        setData({ name: "", description: "", price: "", category: "Salad" })
        setImage(false)
        toast.success(response.data.message)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className='add-page'>
      <div className="add-header">
        <h1 className="page-title">ADD ITEM</h1>
        <p className="page-sub">Add a new food item to your menu</p>
      </div>

      <form className='add-form' onSubmit={onSubmitHandler}>

        {/* Image Upload */}
        <div className="add-section">
          <p className="field-label">UPLOAD IMAGE</p>
          <label htmlFor="image" className="upload-area">
            {image ? (
              <img src={URL.createObjectURL(image)} alt="preview" className="preview-img" />
            ) : (
              <div className="upload-placeholder">
                <span className="upload-icon">📷</span>
                <span>Click to upload image</span>
                <span className="upload-hint">PNG, JPG up to 10MB</span>
              </div>
            )}
            <div className="upload-glow"></div>
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden required />
        </div>

        {/* Name */}
        <div className="add-section">
          <p className="field-label">PRODUCT NAME</p>
          <input
            className="dark-input"
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name='name'
            placeholder='e.g. Spicy Paneer Roll'
            required
          />
        </div>

        {/* Description */}
        <div className="add-section">
          <p className="field-label">DESCRIPTION</p>
          <textarea
            className="dark-input dark-textarea"
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="4"
            placeholder='Describe the dish — ingredients, taste, highlights...'
            required
          />
        </div>

        {/* Category + Price */}
        <div className="add-row">
          <div className="add-section">
            <p className="field-label">CATEGORY</p>
            <select className="dark-input dark-select" onChange={onChangeHandler} value={data.category} name="category">
              <option value="Salad">🥗 Salad</option>
              <option value="Rolls">🌯 Rolls</option>
              <option value="Deserts">🍰 Deserts</option>
              <option value="Sandwich">🥪 Sandwich</option>
              <option value="Cake">🎂 Cake</option>
              <option value="Pure Veg">🥦 Pure Veg</option>
              <option value="Pasta">🍝 Pasta</option>
              <option value="Noodles">🍜 Noodles</option>
              <option value="Fast Food">🍔 Fast Food</option>
            </select>
          </div>

          <div className="add-section">
            <p className="field-label">PRICE (₹)</p>
            <input
              className="dark-input"
              onChange={onChangeHandler}
              value={data.price}
              type="text"
              name='price'
              placeholder='e.g. 199'
              required
            />
          </div>
        </div>

        <button type='submit' className='add-submit-btn'>
          <span>+ ADD TO MENU</span>
          <div className="btn-glow"></div>
        </button>

      </form>
    </div>
  )
}

export default Add
