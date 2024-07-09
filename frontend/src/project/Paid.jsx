import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import './nav.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Paid() {
  return (
    <Container className="my-5">
      <Card.Body>
        <div className='paid'>
          <img src="https://vectorified.com/images/success-icon-png-11.png" alt="Order Success"></img>
          <p className="bold mb-4">Thank you for your purchase , Your order has been placed successfully !!</p>
          <Link to="/vieworders">View orders</Link>
        </div>
      </Card.Body>
    </Container>
  );
}
