import React, { useContext, useEffect, useState } from 'react';
import { Table, Button, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Mycontext } from "./Newcont";
import Heading from './heading';

function Pcart() {
  const { productData, cart, setCart } = useContext(Mycontext);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (userEmail) {
      fetchCart();
    }
  }, [userEmail]);

  useEffect(() => {
    setCartItemCount(cart.length);
  }, [cart]);

  const fetchCart = async () => {
    try {
      const response = await axios.post("http://localhost:4400/api/user/cartdata", { email: userEmail });
      const cartData = response.data.cart.map(item => ({
        ...item,
        quantity: item.quantity || 1,
      }));
      setCart(cartData);
      console.log("fetch cart data", response.data);
    } catch (error) {
      console.log("Error fetching cart data:", error);
    }
  };

  const removeItem = async (id) => {
    try {
      const response = await axios.post("http://localhost:4400/api/user/removeFromcart", {
        email: userEmail,
        id: id,
      });

      if (response.data.success) {
        const updatedCart = cart.filter((item) => item.id !== id);
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
      const newQuantity = item.quantity + 1;
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
  
  const clearCart = async () => {
    try {
      const response = await axios.post("http://localhost:4400/api/user/clearcart", {
        email: userEmail,
      });

      if (response.data.success) {
        setCart([]);
        console.log("Cart cleared successfully");
      } else {
        console.log("Failed to clear cart:", response.data.error);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProductIds((prevSelected) => {
      if (prevSelected.includes(productId)) {
        return prevSelected.filter((id) => id !== productId);
      } else {
        return [...prevSelected, productId];
      }
    });
  };

  const handleBuySelected = () => {
    if (selectedProductIds.length === 0) {
      alert('Please select at least one product.');
      return;
    }
  
    const selectedProducts = products.filter((product) => selectedProductIds.includes(product._id));
    navigate('/buynow', { state: { product: selectedProducts } });
  };
  

  const cartIds = cart.map((cartItem) => cartItem.id);
  const products = productData
    .filter((data) => cartIds.includes(data._id.toString()))
    .map((product) => {
      const cartItem = cart.find((item) => item.id === product._id);
      if (cartItem) {
        return { ...product, quantity: cartItem.quantity };
      } else {
        return null;
      }
    })
    .filter(Boolean);

  const calculateTotal = () => {
    return products.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <header>
      <Heading />
      <div className="container mt-4">
        {cart.length === 0 ? (
          <img src="https://i.pinimg.com/736x/1d/26/ce/1d26cefaf3331a4eb7169c7315dfb853.jpg" width="350px"></img>
        ) : (
          <>
           <Button variant="btn outline-danger" onClick={clearCart} className="mb-3">
              ClearAll
            </Button>
            <Table table-light>
              <thead>
                <tr>
                  <th>Select</th>
                  <th></th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedProductIds.includes(item._id)}
                        onChange={() => handleSelectProduct(item._id)}
                      />
                    </td>
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
                    <td>₹{item.price * item.quantity}</td>
                    <td>
                      <Button variant="outline-dark" size="sm" onClick={() => removeItem(item._id)}>Remove</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="payment-section ">
              <h5>Total Amount: ₹{calculateTotal()}</h5>
              <Button variant="success" onClick={handleBuySelected}>Place Order</Button>
              <Button variant="primary" onClick={() => navigate('/Payment', { state: { cart: cart } })}>Proceed to Payment</Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

export default Pcart;
