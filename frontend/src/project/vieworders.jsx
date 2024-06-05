import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';

function Vieworders() {
  const [orders, setOrders] = useState([]);
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    console.log("User Email:", userEmail);

    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:4400/api/user/getsummary", { email: userEmail });
        console.log("Fetched orders response:", response.data);
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    if (userEmail) {
      fetchOrders();
    } else {
      console.error('No user email found in localStorage');
    }
  }, [userEmail]);

  return (
    <div className='Vieworders'>
      <h1>My Orders</h1>
      <Table className="table-light" striped bordered hover>
        <thead> 
          <tr>
            <th>Date</th>
            <th>Address</th>
            <th>PinCode</th>
            <th>Phone</th>
            <th>Amount</th>
            <th>Payment</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>{order.deliveryaddress.address}</td>
              <td>{order.deliveryaddress.pin}</td>
              <td>{order.deliveryaddress.phone}</td>
              <td>₹{order.payable}</td>
              <td>{order.paymentStatus}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default Vieworders;
