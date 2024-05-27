import React, { useContext, useState } from 'react';
import { Table } from 'react-bootstrap';
import { Mycontext } from './Newcont';
import { useLocation } from 'react-router-dom';

export default function Buynow() {
  const { productData, cart } = useContext(Mycontext);
  const [form, setForm] = useState({
    name: '',
    address: '',
    email: '',
    area: '',
    pin: '',
    city: '',
    phone: ''
  });

  const [savedAddress, setSavedAddress] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = (e) => {
    e.preventDefault(); // Prevent default form submission
    setSavedAddress(form);
    alert('Address saved');
    setForm({
      name: '',
      address: '',
      email: '',
      area: '',
      pin: '',
      city: '',
      phone: ''
    });
  };

  const location = useLocation();
  const product = location.state && location.state.product;

  const cartIds = cart.map((cartItem) => cartItem.id);
  const products = productData.filter((data) => cartIds.includes(data._id.toString()));

  console.log("loc", product);

  return (
    <div className='buynow'>
      <div className='del'>
        <h1>Deliver To</h1>
        <form onSubmit={handleSave} className='deli'>
          <div className='delform'>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder='Name' required />
            <input type="text" name="address" value={form.address} onChange={handleChange} placeholder='Address' required />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder='Email' required />
            <input type="text" name="area" value={form.area} onChange={handleChange} placeholder='Area' required />
          </div>
          <div className='delform2'>
            <input type="text" name="pin" value={form.pin} onChange={handleChange} placeholder='Pin' required />
            <input type="text" name="city" value={form.city} onChange={handleChange} placeholder='City' required />
            <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder='Phone' required />
            <div className='bttn'>
              <button type="submit">Save</button>
            </div>
          </div>
        </form>
        {savedAddress && (
          <div className='saved-address'>
            <h2>Saved Address:</h2>
            <p>Name: {savedAddress.name}</p>
            <p>Address: {savedAddress.address}</p>
            <p>Email: {savedAddress.email}</p>
            <p>Area: {savedAddress.area}</p>
            <p>Pin: {savedAddress.pin}</p>
            <p>City: {savedAddress.city}</p>
            <p>Phone: {savedAddress.phone}</p>
          </div>
        )}
      </div>
      <div className='summary'>
        <div className="col-md-8">
          <Table table-light size="sm">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Image</th>
                <th style={{ width: '25%' }}>Name</th>
                <th style={{ width: '25%' }}>Category</th>
                <th style={{ width: '25%' }}>Quantity</th>
                <th style={{ width: '25%' }}>Price</th>
              </tr>
            </thead>
            <tbody>
              {product && (
                <tr>
                  <td>
                    <img src={product.image} alt={product.name} style={{ width: '120px', height: '110px' }} />
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.quantity}</td>
                  <td>₹{product.price * (product.quantity || 1)}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
      <div className='paybtn'>
        <button type="button" className="btn btn-warning">PAY NOW</button>
      </div>
    </div>
  );
}
