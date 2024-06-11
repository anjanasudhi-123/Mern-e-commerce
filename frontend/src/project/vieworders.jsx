import React, { useState, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
import axios from 'axios';

function ViewOrders() {
  const [orders, setOrders] = useState([]);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    console.log("email", userEmail)
    if (userEmail) {
      axios.post('http://localhost:4400/api/user/getorder', { email: userEmail })
        .then(response => {
          console.log("Orders fetched:", response.data.orders);
          setOrders(response.data.orders);
        })
        .catch(error => {
          console.error('Error fetching orders:', error);
        });
    }
  }, [userEmail]);

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <Container className='ordersummary mt-5'>
      <h1 className="text-center mb-4">My Orders</h1>
      <Table striped bordered hover className="table-centered">
        <thead>
          <tr>
            <th>Date</th>
            <th></th>
            <th>Product Details</th>
            <th>Delivery Address</th>
            <th>Payable Amount</th>
            <th>Status</th>
            <th>Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{order.date ? formatDate(order.date) : formatDate(new Date())}</td>
              <td></td>
              <td>
                {order.products ? order.products.map(product => (
                  <div key={product.productId}>
                    {product.name} (x{product.quantity})
                  </div>
                )) : 'No products'}
              </td>
              <td>
                {order.deliveryaddress ? (
                  <>
                    {order.deliveryaddress.name}, {order.deliveryaddress.address}, {order.deliveryaddress.area}, {order.deliveryaddress.city}, {order.deliveryaddress.pin}, {order.deliveryaddress.phone}
                  </>
                ) : 'No address'}
              </td>
              <td>{order.products.reduce((total, prod) => total + prod.price * prod.quantity, 0)}</td>
              <td>{order.status}</td>
              <td>{order.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default ViewOrders;
