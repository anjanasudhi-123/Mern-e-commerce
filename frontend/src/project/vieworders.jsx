import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './nav.css';

function ViewOrders(props) {
  const { paymentStatus } = props;
  const [orders, setOrders] = useState([]);
  const userEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    console.log("email", userEmail);
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const groupOrdersByDate = (orders) => {
    return orders.reduce((groupedOrders, order) => {
      const orderDate = formatDate(order.date || new Date());
      if (!groupedOrders[orderDate]) {
        groupedOrders[orderDate] = [];
      }
      groupedOrders[orderDate].push(order);
      return groupedOrders;
    }, {});
  };

  const groupedOrders = groupOrdersByDate(orders);

  console.log("grouped", groupedOrders);

  return (
    <Container className='ordersummary'>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className='btnback'>
          <Link to="/collections" className="btn btn-outline-secondary">Back</Link>
        </div>
      </div>
      {paymentStatus === 'Success' && (
        <Alert variant="success">
          Payment successful! Thank you for your order.
        </Alert>
      )}

      {orders.length === 0 ? (
        <div className="text-center mt-4">
          <h2>No orders yet!</h2>
        </div>
      ) : (
        Object.keys(groupedOrders).map((date, index) => (
          <div key={index}>
            <h2 className="">{date}</h2>
            <Table  className="table table-hover">
              <thead className="">
                <tr>
                  <th>Product Details</th>
                  <th>Delivery Address</th>
                  <th>Payable Amount</th>
                  <th>Status</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {groupedOrders[date].map((order, orderIndex) =>
                  <tr key={orderIndex}>
                    <td>
                      {order.products && order.products.map((product, productIndex) =>
                        <div key={product.productId || productIndex} className="d-flex align-items-center mb-2">
                          <img src={product.image} alt={product.name} className="img-thumbnail" style={{ width: '90px', height: '150px', marginRight: '10px' }} />
                          <div>
                            {product.name} ({product.quantity})
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      {order.deliveryAddress ? (
                        <div>
                          {order.deliveryAddress.name}<br />
                          {order.deliveryAddress.address}, {order.deliveryAddress.area}<br />
                          {order.deliveryAddress.city}, {order.deliveryAddress.pin}<br />
                          {order.deliveryAddress.phone}
                        </div>
                      ) : 'No address'}
                    </td>
                    <td>₹{order.products.reduce((total, prod) => total + prod.price * prod.quantity, 0)}</td>
                    <td>{order.status === 'Completed' ? 'Successful' : order.status}</td>
                    <td>{order.paymentStatus === 'Paid' ? 'Successful' : order.paymentStatus}</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        ))
      )}
    </Container>
  );
}

export default ViewOrders;
