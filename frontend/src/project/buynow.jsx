import React, { useContext, useState, useEffect } from 'react';
import { Table } from 'react-bootstrap';
import { Mycontext } from './Newcont';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Buynow() {
  const nav = useNavigate();
  const { productData } = useContext(Mycontext);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectaddress, setSelectAddress] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const userEmail = localStorage.getItem("userEmail");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
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
  const cartFromState = Array.isArray(state?.product) ? state.product : [];
  const [payable, setPayable] = useState(0);
  const [orderData, setOrderData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('Pending');

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
        const updatedAddresses = savedAddress.filter((address, i) => i !== index);
        setSavedAddress(updatedAddresses);
        if (selectaddress === index) {
          setSelectAddress(null);
        } else if (selectaddress > index) {
          setSelectAddress(selectaddress - 1);
        }
      })
      .catch(error => {
        console.error("Error deleting address:", error);
      });
  };


  const clearCart = async (productIds = []) => {
    try {
      const response = await axios.post("http://localhost:4400/api/user/removeFromcart", {
        email: userEmail,
        ids: productIds,
      });
  
      if (response.data.success) {
        const updatedCart = cart.filter((item) => !productIds.includes(item.id));
        setCart(updatedCart);
        console.log("Selected products removed successfully");
      } else {
        console.log("Failed to remove selected products:", response.data.error);
      }
    } catch (error) {
      console.error("Error removing selected products from cart:", error);
    }
  };
  





  const calculatePayable = () => {
    let total = 0;
    if (cartFromState.length > 0) {
      total = cartFromState.reduce((acc, cartItem) => {
        const product = productData.find(p => p._id === cartItem._id);
        if (product) {
          return acc + (product.price * cartItem.quantity);
        } else {
          console.error(`Product with ID ${cartItem._id} not found`);
        }
        return acc;
      }, 0);
    }
    return total;
  };

  const handleAddressSelect = (index) => {
    setSelectAddress(index);
    const selectedAddress = savedAddress[index];
    if (selectedAddress) {
      const orderData = {
        email: selectedAddress.email,
        name: selectedAddress.name,
        address: selectedAddress.address,
        pin: selectedAddress.pin,
        city: selectedAddress.city,
        area: selectedAddress.area,
        phone: selectedAddress.phone,
        payment: totalAmount,
        products: cartFromState.map(cartItem => {
          const product = productData.find(p => p._id === cartItem._id);
          if (!product) {
            console.error(`Product with ID ${cartItem._id} not found`);
            return null;
          }
          return {
            productId: product._id,
            image:product.image,
            name: product.name,
            quantity: cartItem.quantity || 1,
            price: product.price || 0,
          };
        }).filter(product => product !== null),
        date: new Date(),
        status: 'Pending',
        paymentStatus: 'Unpaid'
      };

      axios.post("http://localhost:4400/api/user/saveorder", orderData)
        .then(response => {
          console.log("Saved order response:", response.data);
        })
        .catch(error => {
          console.error('Error saving order:', error);
        });
    } else {
      alert('Selected address not found.');
    }
  };

  useEffect(() => {
    const total = calculatePayable();
    setTotalAmount(total);
    setPayable(total);
  }, [cartFromState, productData]);

  useEffect(() => {
    if (userEmail) {
      axios.post("http://localhost:4400/api/user/getaddress", { email: userEmail })
        .then(response => {
          setSavedAddress(response.data.currentUser);
          const savedDeliveryAddress = JSON.parse(localStorage.getItem('deliveryAddress'));
          if (savedDeliveryAddress) {
            const addressIndex = response.data.currentUser.findIndex(address => address._id === savedDeliveryAddress._id);
            if (addressIndex !== -1) {
              setSelectAddress(addressIndex);
            }
          }
        })
        .catch(error => {
          console.error("Error fetching address:", error);
        });
    }
  }, [userEmail]);

  useEffect(() => {
    console.log('Form state:', form);
    console.log('Cart from state:', cartFromState);
  }, [form, cartFromState]);

  useEffect(() => {
    console.log('Product data:', productData);
  }, [productData]);

  const handlerazorpay = async () => {
    if (selectaddress === null) {
      alert('Please select a delivery address.');
      return;
    }

    const deliveryAddress = savedAddress[selectaddress];
    const products = cartFromState.map(cartItem => {
      const product = productData.find(p => p._id === cartItem._id);
      return {
        productId: product._id,
        name: product.name,
        image:product.image,
        quantity: cartItem.quantity || 1,
        price: product.price || 0,
      };
    });

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
        key: 'rzp_test_JorS0iNRvZWc0T',
        amount: amount.toString(),
        currency: currency,
        name: 'Luxehaven',
        description: 'Test Transaction',
        order_id: order_id,
        handler: async function (response) {
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

          try {
            const validateResponse = await axios.post('http://localhost:4400/api/user/validatepayment', paymentPayload, {
              headers: {
                'Content-Type': 'application/json',
              },
            });

            setOrderData(validateResponse.data.order);

            handleSuccessfulPayment();


            const productIdsToRemove = products.map(product => product.productId);
            await clearCart(productIdsToRemove);

            nav('/Paid', { state: { selectaddress, totalAmount, products, orderData: validateResponse.data.order } });
          } catch (error) {
            console.error('Error validating payment:', error);
            alert('Failed to validate payment. Please try again.');
          }
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

  const clearCartAfterPurchase = async () => {
    try {
      const response = await axios.post('http://localhost:4400/api/user/clearselectitems', {
        email: userEmail,
        selectedProductIds: cartFromState.map(item => item._id),
      });

      if (response.data.success) {
        setCart([]);
        nav('');
      } else {
        console.error('Failed to clear selected items from cart:', response.data.error);
      }
    } catch (error) {
      console.error('Error clearing selected items from cart:', error);
    }
  };






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
                </tr>
              </thead>
              <tbody>
                {savedAddress.map((address, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={selectaddress === index}
                        onChange={() => handleAddressSelect(index)}
                      />
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
      {selectaddress !== null && (
        <div className='selected-address-details bg-light p-3 rounded shadow-sm'>
          <h4>Address to Deliver : </h4>
          <p><strong>{savedAddress[selectaddress].name}, </strong></p>
          <p><strong>{savedAddress[selectaddress].address}, </strong></p>
          <p><strong>{savedAddress[selectaddress].area}, </strong></p>
          <p><strong>{savedAddress[selectaddress].pin}, </strong></p>
          <p><strong>{savedAddress[selectaddress].city}, </strong></p>
          <p><strong>{savedAddress[selectaddress].phone} </strong></p>
        </div>
      )}
      <div className="row">
        <div className="col-md-5">
          <Table className="table" size="sm">
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
              {cartFromState.map((cartItem, index) => {
                const product = productData.find(p => p._id === cartItem._id);
                return (
                  <tr key={index}>
                    <td><img src={cartItem.image} alt={cartItem.name} style={{ width: '50px', height: '50px' }} /></td>
                    <td>{cartItem.name}</td>
                    <td>{cartItem.category}</td>
                    <td>{cartItem.quantity}</td>
                    <td>₹{parseInt(cartItem.price) * parseInt(cartItem.quantity)}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <h4>Total Amount: ₹{totalAmount}</h4>
        </div>
      </div>
      <div className='paybtn'>
        <button type="button" className="btn btn-warning" onClick={handlerazorpay}>{`Proceed to payment of ₹${totalAmount} through Payment Gateway ->`}</button>
      </div>
    </div>
  );
}
