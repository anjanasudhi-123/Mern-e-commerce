import React, { useState, useEffect } from 'react';
import { Table, Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
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
      <div className="justify-content-between align-items-center mb-4">
        <div className="text-right">
          <Link to="/collections">Back</Link>
        </div>
      </div>
      {paymentStatus === 'Success' && (
        <div className="alert alert-success" role="alert">
          Payment successful! Thank you for your order.
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center mt-4">
          <h2>No orders yet !!</h2>
        </div>
      ) : (
        Object.keys(groupedOrders).map((date, index) => (
          <div key={index}>
            <h2 className="text-center mt-4">{date}</h2>
            <Table striped bordered hover className="table-centered">
              <thead>
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
                        <div key={product.productId || productIndex}>
                          {product.name} x{product.quantity}
                        </div>
                      )}
                    </td>
                    <td>
                      {order.deliveryAddress ? (
                        <>
                          {order.deliveryAddress.name}, {order.deliveryAddress.address}, {order.deliveryAddress.area}, {order.deliveryAddress.city},
                          {order.deliveryAddress.pin}, {order.deliveryAddress.phone}
                        </>
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
