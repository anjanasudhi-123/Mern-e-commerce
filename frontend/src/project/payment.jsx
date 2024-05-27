import React, { useState, useContext, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Mycontext } from "./Newcont";
import { useLocation } from 'react-router-dom';

function Payment() {
  const { productData } = useContext(Mycontext);
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
  const location = useLocation();
  const { state } = location;
  const cartFromState = state.cart;
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const cartIds = cartFromState.map(cartItem => cartItem.id);
    const productsWithQuantity = productData
      .filter(data => cartIds.includes(data._id.toString()))
      .map(product => ({
        ...product,
        quantity: cartFromState.find(cartItem => cartItem.id === product._id.toString()).quantity
      }));
    setProducts(productsWithQuantity);
  }, [cartFromState, productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
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

  const calculateTotal = () => {
    return products.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className='buynow'>
      <div className='delpro'>
        <h1>Deliver To</h1>
        <form onSubmit={handleSave} className='delipro'>
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
      <div className="row">
        <div className="col-md-5">
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
              {products.map(item => (
                <tr key={item._id}>
                  <td><img src={item.image} alt={item.name} style={{ width: '50px', height: '50px' }} /></td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <h4>Total Amount: ₹{calculateTotal()}</h4>
        </div>
      </div>
      <div className='paybtn'>
        <button type="button" className="btn btn-warning">PAY NOW</button>
      </div>
    </div>
  );
}

export default Payment;
