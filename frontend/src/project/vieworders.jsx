import React from 'react';
import { Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

function Vieworders() {
  const location = useLocation();
  const { payable, deliveryaddress } = location.state || { payable: 0, deliveryaddress: {} };

  return (
    <div className='Vieworders'>
      <h1>My Orders</h1>
      <Table className="table-light" striped bordered hover width="20%">
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
          {deliveryaddress && (
            <tr>
              <td>{new Date().toLocaleDateString()}</td>
              <td>{deliveryaddress.address}</td>
              <td>{deliveryaddress.pin}</td>
              <td>{deliveryaddress.phone}</td>
              <td>₹{payable}</td>
              <td>Paid</td>
              <td>Processing</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default Vieworders;
