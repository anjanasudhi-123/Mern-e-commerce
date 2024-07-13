import React, { useState, useContext, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Mycontext } from "./Newcont";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Payment() {
  const nav = useNavigate();
  const { productData } = useContext(Mycontext);
  const [totalAmount, setTotalAmount] = useState(0);
  const [payable, setPayable] = useState(0);
  const [editIndex, setEditIndex] = useState(null);
  const userEmail = localStorage.getItem("userEmail");

  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [orderData, setOrderData] = useState(null)


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
  const [products, setProducts] = useState([]);
  const [selectAddress, setSelectAddress] = useState(null);

  useEffect(() => {
    const cartIds = cartFromState.map(cartItem => cartItem.id);
    const productsWithQuantity = productData.filter(data => cartIds.includes(data._id.toString())).map(product => ({
      ...product,
      quantity: cartFromState.find(cartItem => cartItem.id === product._id.toString()).quantity
    }));
    setProducts(productsWithQuantity);
    setPayable(productsWithQuantity.reduce((total, product) => total + product.price * product.quantity, 0));
  }, [cartFromState, productData]);

  useEffect(() => {
    if (userEmail) {
      axios.post("http://localhost:4400/api/user/getaddress", { email: userEmail })
        .then(response => {
          setSavedAddress(response.data.currentUser);
        })
        .catch(error => {
          console.error("Error fetching address:", error);
        });
    }
  }, [userEmail]);

  useEffect(() => {
    const savedAddressFromStorage = JSON.parse(localStorage.getItem("deliveryAddress"));
    if (savedAddressFromStorage) {
      const addressIndex = savedAddress.findIndex(address => address._id === savedAddressFromStorage._id);
      if (addressIndex !== -1) {
        setSelectAddress(addressIndex);
      }
    }
  }, [savedAddress]);

  const handleAddress = (index) => {
    setSelectAddress(index);
    const selectedAddress = savedAddress[index];
    if (selectedAddress) {
      localStorage.setItem("deliveryAddress", JSON.stringify(selectedAddress));
      const { email: userEmail, name, address, pin, phone } = selectedAddress;
      const orderData = {
        email: userEmail,
        name,
        address,
        pin,
        phone,
        payment: payable,
        products: products.map(product => ({
          productId: product._id,
          image:product.image,
          name: product.name,
          quantity: product.quantity,
          price: product.price
        })),
        date: new Date(),
        status: 'Pending',
        paymentStatus: 'Unpaid'
      };
      axios.post("http://localhost:4400/api/user/saveorder", orderData)
        .then(response => {
          console.log("Order placed successfully:", response.data);

        })
        .catch(error => {
          console.error("Error placing order:", error);
        });
    } else {
      console.log("Selected address not found.");
    }
  };

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
    alert('Address saved');
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setForm(savedAddress[index]);
  };

  const handleDelete = (index) => {
    const addressId = savedAddress[index]._id;
    axios.delete("http://localhost:4400/api/user/deleteaddress", { data: { email: userEmail, addressId } })
      .then(response => {
        const updatedAddresses = savedAddress.filter((address, i) => i !== index);
        setSavedAddress(updatedAddresses);
        if (selectAddress === index) {
          setSelectAddress(null);
        } else if (selectAddress > index) {
          setSelectAddress(selectAddress - 1);
        }
      })
      .catch(error => {
        console.error("Error deleting address:", error);
      });
  };

  const deliveryAddress = selectAddress !== null ? savedAddress[selectAddress] : null;



  const handlerazorpay = async () => {
    if (!deliveryAddress) {
      alert('Please select a delivery address.');
      return;
    }

    try {
      const orderResponse = await axios.post('http://localhost:4400/api/user/makepayment', {
        amount: payable, 
        currency: 'INR'
      });

      if (!orderResponse.data || !orderResponse.data.id) {
        alert('Failed to create order. Please try again.');
        console.error('Order Response:', orderResponse.data);
        return;
      }

      const { amount, id: order_id, currency } = orderResponse.data;

      const options = {
        key: 'rzp_test_JorS0iNRvZWc0T', // Ensure this matches your actual Razorpay Key ID
        amount: amount.toString(),
        currency: currency,
        name: 'Luxehaven',
        description: 'Test Transaction',
        order_id: order_id,
        handler: async function (response) {
          console.log('Razorpay Response:', response);

          const paymentPayload = {
            paymentId: response.razorpay_payment_id,
            deliveryAddress,
            orderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
            products,
            payable,
            totalAmount,
            email: userEmail
          };

          console.log('Payment Payload:', paymentPayload);

          const validateResponse = await axios.post('http://localhost:4400/api/user/validatepayment', paymentPayload, {
            headers: {
              'Content-Type': 'application/json',
            },
          });

          setOrderData(validateResponse.data.order);

          handleSuccessfulPayment();
          nav('/Paid', { state: { deliveryAddress, payable, products, orderData: validateResponse.data.order } });
        },
        prefill: {
          name: 'anjana',
          email: 'anjana@gmail.com',
          contact: '9999999999'
        },
        notes: {
          address: 'Your address'
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      alert('Oops, something went wrong. Error in opening checkout');
    }
  };



  const handleSuccessfulPayment = () => {
    setPaymentStatus('Success');
  };

  return (
    <div className='buynow'>
      {paymentStatus === 'Success' && (
        <div className="alert alert-success" role="alert">
          Payment successful! Thank you for your order.
        </div>
      )}
      {/* <Link to={"/vieworders"}>Order</Link> */}
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
                  <th>Actions</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {savedAddress.map((address, index) => (
                  <tr key={index}>
                    <td>
                      <input type="radio" name="selectedAddress" checked={selectAddress === index} onChange={() => handleAddress(index)} />
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
      {deliveryAddress && (
        <div className='selected-address-details'>
          <h4>Address to Deliver:</h4>
          <p><strong>{deliveryAddress.name},</strong></p>
          <p><strong>{deliveryAddress.address},</strong></p>
          <p><strong>{deliveryAddress.area},</strong></p>
          <p><strong>{deliveryAddress.city},</strong></p>
          <p><strong>{deliveryAddress.pin},</strong></p>
          <p><strong>{deliveryAddress.phone}</strong></p>
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
        <button type="button" className="btn btn-warning" onClick={handlerazorpay}>{`Proceed to payment of ₹${payable} through Payment Gateway ->`}</button>
      </div>
    </div>
  );
}

export default Payment;
