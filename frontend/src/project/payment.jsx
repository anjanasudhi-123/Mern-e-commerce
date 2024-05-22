import React, { useState, useContext } from 'react';
import { Table } from 'react-bootstrap';
import { Mycontext } from "./Newcont";

function Payment() {
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

  const handleChange = (e) => {
    setForm(e.target.value);
  };

  const handleSave = () => {
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
    return cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
  };

  const cartIds = cart.map((cartItem) => cartItem.id);
  const products = productData.filter((data) => cartIds.includes(data._id.toString()));

  return (
    <div className="pay">
      <h2>Order summary</h2>
      <div className='deli'>
        <div className='delform'>
          <input type="text" name="name" value={form.name} onChange={handleChange} placeholder='Name' />
          <input type="text" name="address"value={form.address}onChange={handleChange}placeholder='Address'/>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder='Email' />
          <input type="text" name="area" value={form.area} onChange={handleChange} placeholder='Area' />
        </div>
        <div className='delform2'>
          <input type="text" name="pin" value={form.pin} onChange={handleChange} placeholder='Pin' />
          <input type="text" name="city" value={form.city} onChange={handleChange} placeholder='City' />
          <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder='Phone' />
          <div className='bttn'>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col">
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
              {products.map((item) => (
                <tr key={item._id}>
                  <td><img src={item.image} alt={item.name} style={{ width: '50px', height: '50px' }} /></td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>₹{item.price}</td>
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
      <button type="button" class="btn btn-warning">PAY NOW</button>      </div>
    </div>
  );
}

export default Payment;
