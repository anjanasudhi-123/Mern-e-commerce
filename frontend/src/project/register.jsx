import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoPerson } from 'react-icons/go';
import { MdLockOpen } from 'react-icons/md';
import { BsFacebook } from 'react-icons/bs';
import { FaInstagram } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Container, Row, Col, Form, Button, Alert, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import './nav.css';  // Ensure your CSS file does not conflict with Bootstrap

function RegisterPage() {
  const [inputemail, setinputemail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setmessage] = useState("");
  const navigate = useNavigate();

  const registerUser = async () => {
    try {
      const response = await axios.post('http://localhost:4400/api/user/register', { email: inputemail, password });
      if (response.data.success) {
        alert("Registration successful! Please log in.");
        navigate("/login");
      } else {
        setmessage("Registration failed. Please check your details.");
      }
    } catch (error) {
      console.log(error);
      setmessage("Registration failed. Please check your details.");
    }
  };

  return (
    <Container className="register-container d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col md={6} className="d-flex flex-column justify-content-center align-items-center bg-light p-4">
          <div className="text-content text-center mb-4 ">
            <h1>Luxehaven</h1>
            <p>Welcome back !!</p>
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
          </div>
        </Col>
        <Col md={6} className="d-flex flex-column justify-content-center align-items-center">
          <h3>Create an account</h3>
          <div className="icons-container my-3">
            <BsFacebook size={20} className="icon" />
            <FaInstagram size={20} className="icon mx-3" />
            <FcGoogle size={20} className="icon" />
          </div>
          <hr className="w-100 my-3" />
          <p className="text-center w-100">or</p>
          <Form className="w-100">
            <InputGroup className="mb-3">
              <InputGroup.Text><GoPerson /></InputGroup.Text>
              <FormControl type="email" placeholder="Enter email here" value={inputemail} onChange={(e) => setinputemail(e.target.value)} required />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text><MdLockOpen /></InputGroup.Text>
              <FormControl type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </InputGroup>
            <Button type="button" className="btn btn-outline-info w-20" onClick={registerUser}>Register</Button>
          </Form>
          {message && <Alert variant="danger" className="mt-3">{message}</Alert>}
        </Col>
      </Row>
    </Container>
  );
}

export default RegisterPage;
