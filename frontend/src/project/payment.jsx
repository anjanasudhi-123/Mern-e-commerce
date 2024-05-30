import React, { useState, useContext, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Mycontext } from "./Newcont";
import { useLocation, useNavigate } from 'react-router-dom';

function Payment() {
  const nav = useNavigate();
  const { productData } = useContext(Mycontext);
  const [payable, setPayable] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    email: '',
    area: '',
    pin: '',
    city: '',
    phone: ''
  });

  const [savedAddress, setSavedAddress] = useState([]);
  const location = useLocation();
  const { state } = location;
  const cartFromState = state.cart;
  const [products, setProducts] = useState([]);
  const [selectaddress, setselectaddress] = useState(null);

  useEffect(() => {
    const cartIds = cartFromState.map(cartItem => cartItem.id);
    const productsWithQuantity = productData.filter(data => cartIds.includes(data._id.toString())).map(product => ({
      ...product,
      quantity: cartFromState.find(cartItem => cartItem.id === product._id.toString()).quantity
    }));
    setProducts(productsWithQuantity);
    setPayable(productsWithQuantity.reduce((total, product) => total + product.price * product.quantity, 0));
  }, [cartFromState, productData]);

  const handleaddress = (index) => {
    setselectaddress(index);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const emailExists = savedAddress.some((address) => address.email === form.email);
    if (emailExists) {
      alert('Address with this email is already saved');
      return;
    }
    if (editIndex !== null) {
      const updatedAddresses = savedAddress.map((address, index) =>
        index === editIndex ? form : address
      );
      setSavedAddress(updatedAddresses);
      setEditIndex(null);
    } else {
      setSavedAddress(prevSavedAddresses => [...prevSavedAddresses, form]);
    }
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

  const handleEdit = (index) => {
    setEditIndex(index);
    setForm(savedAddress[index]);
  };

  const deliveryaddress = selectaddress !== null ? savedAddress[selectaddress] : null;

  const handlePayment = (e) => {
    e.preventDefault();
    nav('/Paid', { state: { deliveryaddress, payable } });
  };

  return (
    <div className='buynow'>
      <div className='delpro'>
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
              <button type="submit">{editIndex !== null ? 'Update' : 'Save'}</button>
            </div>
          </div>
        </form>
        {savedAddress.length > 0 && (
          <div className='saved-address'>
            <Table>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Pin</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {savedAddress.map((address, index) => (
                  <tr key={index}>
                    <td>
                      <input type="radio" name="selectedAddress" checked={selectaddress === index} onChange={() => handleaddress(index)} />
                    </td>
                    <td>{address.name}</td>
                    <td>{address.address}</td>
                    <td>{address.pin}</td>
                    <td>{address.phone}</td>
                    <td>
                      <button className='btn btn-light' onClick={() => handleEdit(index)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
      {deliveryaddress && (
        <div className='selected-address-details'>
          <h4>Address to Deliver:</h4>
          <p><strong>{deliveryaddress.name},</strong></p>
          <p><strong>{deliveryaddress.address},</strong></p>
          <p><strong>{deliveryaddress.area},</strong></p>
          <p><strong>{deliveryaddress.city},</strong></p>
          <p><strong>{deliveryaddress.pin},</strong></p>
          <p><strong>{deliveryaddress.phone}</strong></p>
        </div>
      )}
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
              {products.map((product) => (
                <tr key={product._id}>
                  <td><img src={product.image} alt={product.name} style={{ width: '50px', height: '50px' }} /></td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.quantity}</td>
                  <td>₹{product.price * product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <h4>Total Amount: ₹{payable}</h4>
        </div>
      </div>
      <div className='paybtn'>
        <button type="button" className="btn btn-warning" onClick={handlePayment}>{`Proceed to payment of ₹${payable} through Payment Gateway ->`}</button>
      </div>
    </div>
  );
}

export default Payment;
