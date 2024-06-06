
// buynow
import React, { useContext, useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Mycontext } from './Newcont';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function Buynow() {

  const nav = useNavigate();
  const { productData, cart } = useContext(Mycontext);
  const [selectaddress, setselectaddress] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const userEmail = localStorage.getItem("userEmail");


  console.log("pay", userEmail);


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
  const cartFromState = state?.cart || [];
  const [payable, setPayable] = useState(0);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const addressData = { ...form, email: userEmail };
    if (editIndex !== null) {
      axios.post("http://localhost:4400/api/user/updateaddress", addressData)
        .then(response => {
          const updatedAddresses = savedAddress.map((address, index) =>
            index === editIndex ? addressData : address
          );
          setSavedAddress(updatedAddresses);
          setEditIndex(null);
        })
        .catch(error => {
          console.error("Error updating address:", error);
        });
    } else {
      axios.post("http://localhost:4400/api/user/addaddress", addressData)
        .then(response => {
          setSavedAddress(prevSavedAddresses => [...prevSavedAddresses, addressData]);
        })
        .catch(error => {
          console.error("Error adding address:", error);
        });
    }

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

  const handleDelete = (index) => {
    const addressId = savedAddress[index]._id;
    axios.delete("http://localhost:4400/api/user/deleteaddress", { data: { email: userEmail, addressId } })
      .then(response => {
        console.log("Deleted address response:", response);
        const updatedAddresses = savedAddress.filter((address, i) => i !== index);
        setSavedAddress(updatedAddresses);
        if (selectaddress === index) {
          setselectaddress(null);
        } else if (selectaddress > index) {
          setselectaddress(selectaddress - 1);
        }
      })
      .catch(error => {
        console.error("Error deleting address:", error);
      });
  };

  const handleaddress = (index) => {
    setselectaddress(index);
  };

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
    if (deliveryaddress) {
    nav('/Paid', { state: { payable: totalAmount } });
  } else {
    alert('Please select a delivery address.');
  }
};


  useEffect(() => {
    const total = calculatePayable();
    setPayable(total)
  }, [product]);

  useEffect(() => {
    console.log("User Email:", userEmail);
    if (userEmail) {
      axios.post("http://localhost:4400/api/user/getaddress", { email: userEmail })
        .then(response => {
          console.log("Fetched addresses response:", response);
          setSavedAddress(response.data.currentUser);
        })
        .catch(error => {
          console.error("Error fetching address:", error);
        });
    }
  }, []);

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
                  <th>Actions</th>
                  <th></th>
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
                      <button className='btn btn-light' onClick={() => handleDelete(index)}>Delete</button>

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
        <button type="button" onClick={handlePayment} className="btn btn-warning">{`Proceed to payment of ₹${payable} through Payment Gateway ->`}</button>
      </div>
    </div>
  );
}
