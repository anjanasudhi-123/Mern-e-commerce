import React, { useState, useEffect } from 'react';
import { Table, Container } from 'react-bootstrap';
import axios from 'axios';
import Adminnav from './adminnav';
import './nav.css';

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.post('http://localhost:4400/api/admin/login/getAllOrders')
      .then(response => setOrders(response.data))
      .catch(error => console.error('Error fetching orders:', error));
  }, []);

  // Group orders by user email
  const groupedOrders = orders.reduce((acc, order) => {
    (acc[order.email] = acc[order.email] || []).push(order);
    return acc;
  }, {});

  return (
    <>
      <Adminnav />
      <Container className="mt-5">
        {Object.entries(groupedOrders).map(([email, userOrders]) => (
          <div key={email} className="mb-4">
            {/* Display user's email as a heading outside the table */}
            <strong className="email-heading">{email}</strong>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Products</th>
                  <th>Delivery Area</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {userOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td>
                      {order.products && order.products.map((product, productIndex) => (
                        <div key={productIndex}>
                          {product.name} ({product.quantity})
                        </div>
                      ))}
                    </td>
                    <td>{order.deliveryAddress.area}</td>
                    <td>₹{order.products.reduce((total, prod) => total + prod.price * prod.quantity, 0)}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ))}
      </Container>
    </>
  );
};

export default AdminOrder;
