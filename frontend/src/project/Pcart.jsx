import React, { useContext, useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useNavigate,useLocation } from 'react-router-dom';
import axios from 'axios';
import { Mycontext } from "./Newcont";
import Heading from './heading';

function Pcart() {
  const {productData, cart, setCart } = useContext(Mycontext);
  const navigate = useNavigate();
  const location=useLocation()
  const [cartItemCount, setCartItemCount] = useState(0);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (userEmail) {
      fetchCart();
    }
  }, []);

  useEffect(() => {
    setCartItemCount(cart.length);
  }, [cart]);

  const fetchCart = async () => {
    try {
      const response = await axios.post("http://localhost:4400/api/user/cartdata", { email: userEmail });
      setCart(response.data.cart);
      console.log("fetch cart data", response.data);
    } catch (error) {
      console.log("Error fetching cart data:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      console.log("Attempting to remove item with ID:", id);
      const response = await axios.post("http://localhost:4400/api/user/removeFromcart", {
        email: userEmail,
        id: id,
      });
      console.log("Removing item:", response.data);

      if (response.data.success) {
        const updatedCart = cart.filter((item) => item.id !== id);
        console.log("Updated cart after removal:", updatedCart);
        setCart(updatedCart);
      } else {
        console.log("Failed to remove item:", response.data.error);
      }
    } catch (error) {
      console.log("Error in deleting item from cart:", error);
    }
  };

  const updateCartQuantity = async (id, newQuantity) => {
    try {
      await axios.post("http://localhost:4400/api/user/updatecart", {
        email: userEmail,
        id: id,
        quantity: newQuantity,
      });
      const updatedCart = cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCart(updatedCart);
    } catch (error) {
      console.error("Error updating cart quantity on the backend:", error);
    }
  };

  const addQty = async (id) => {
    const item = cart.find((item) => item.id === id);
    if (item) {
      const newQuantity = (item.quantity || 1) + 1;
      await updateCartQuantity(id, newQuantity);
    }
  };

  const removeQty = async (id) => {
    const item = cart.find((item) => item.id === id);
    if (item && item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      await updateCartQuantity(id, newQuantity);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
  };

  const cartIds = cart.map((cartItem) => cartItem.id);
  const products = productData.filter((data) => cartIds.includes(data._id.toString()));
  console.log("pr", products);


  const handlebuy = (product) => {
    navigate('/buynow', { state: { ...location.state, product } });
  };
  


  return (
    <header>
      <Heading />
      <div className="container mt-4">
        {cart.length === 0 ? (
          <h3>Your cart is empty.</h3>
        ) : (
          <>
            <Table table-light>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <img src={item.image} alt={item.name} style={{ width: '120px', height: '110px' }} />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>₹{item.price}</td>
                    <td>
                      <Button variant="light" size="sm" onClick={() => removeQty(item._id)}>-</Button>
                      <span style={{ margin: '0 7px' }}>{item.quantity}</span>
                      <Button variant="light" size="sm" onClick={() => addQty(item._id)}>+</Button>
                    </td>
                    <td>₹{item.price * (item.quantity || 1)}</td>
                    <td>
                      <Button variant="outline-dark" size="sm" onClick={() => removeItem(item._id)}>Remove</Button>
                      <Button variant="outline-success" size="sm" className="ml-2" onClick={()=>handlebuy(item)}>Place Order</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="payment-section text-right">
      <h5>Total Amount: ₹{calculateTotal()}</h5>
      <Button variant="primary" onClick={() => navigate(`/Payment`, { cart: cart })}>  Proceed to Payment</Button>

    </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Pcart;
