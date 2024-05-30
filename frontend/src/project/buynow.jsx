
// buynow
import React, { useContext, useState,useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Mycontext } from './Newcont';
import { useLocation,useNavigate} from 'react-router-dom';

export default function Buynow() {

  const nav = useNavigate();
  const { productData, cart } = useContext(Mycontext);
  const [selectaddress, setselectaddress] = useState(null);
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
  const [payable, setPayable] = useState(0); 

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log('Checking if email exists...');
    const emailExists = savedAddress.some((address) => address.email === form.email);
    console.log('Email exists:', emailExists);
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
      setSavedAddress((prevSavedAddresses) => [...prevSavedAddresses, form]);
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

  const handleaddress = (index) => {
    setselectaddress(index);
  };

  const location = useLocation();
  const product = location.state && location.state.product;

  const cartIds = cart.map((cartItem) => cartItem.id);
  const products = productData.filter((data) => cartIds.includes(data._id.toString()));
  console.log("loc", product);
  
  const deliveryaddress = selectaddress !== null ? savedAddress[selectaddress] : null;
  console.log("deliveryaddress", deliveryaddress)

  const calculatePayable = () => {
    let total = 0;
    if (product) {
      total += product.price * (product.quantity || 1);
    }
    return total;
  };


  const handlePayment = () => {
    // console.log("total",totalAmount);
    const totalAmount = calculatePayable(); 
    nav('/Paid', { state: {payable:totalAmount } });
  };

  useEffect(() => {
   const total= calculatePayable();
   setPayable(total)
  }, [product]);

  return (
    <div className='buynow'>
      <div className='del'>
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
                      <input type="radio" name="selectedAddress" checked={selectaddress === index}
                        onChange={() => handleaddress(index)} />
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
          <p><strong> {deliveryaddress.name} ,</strong></p>
          <p><strong>{deliveryaddress.address}, </strong></p>
          <p><strong>{deliveryaddress.area} ,</strong></p>
          <p><strong> {deliveryaddress.city} ,</strong></p>
          <p><strong>{deliveryaddress.pin} , </strong></p>
          <p><strong>{deliveryaddress.phone} </strong></p>
        </div>
      )}
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
        <button type="button"  onClick={handlePayment }className="btn btn-warning">{`Proceed to payment of ₹${payable} through Payment Gateway ->`}</button>
      </div>
    </div>
  );
}
