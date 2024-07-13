import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoPerson } from 'react-icons/go';
import { MdLockOpen } from 'react-icons/md';
import { BsFacebook } from "react-icons/bs";
import { FaInstagram } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

import { Container, Row, Col, Form, Button, Alert, InputGroup, FormControl } from 'react-bootstrap';
import { Mycontext } from "./Newcont";
import axios from 'axios';
import './nav.css';

function Loginpage() {
  const [inputemail, setinputemail] = useState("");
  const [password, setPassword] = useState("");
  const { store, setstore, setloggeduser, setCart, setLikeitem } = useContext(Mycontext);
  const [message, setmessage] = useState("");
  const navigate = useNavigate();
  const handleLogout = () => {
    setloggeduser(null);
    setCart([]);
    setLikeitem([]);
    localStorage.removeItem("userEmail");
    localStorage.removeItem("authToken");
    alert("Logout successful!");
    navigate("/");
    window.location.reload()
  };


  const loginUser = async () => {
    axios.post('http://localhost:4400/api/user/login', { email: inputemail, password })
      .then(response => {

        const userData = response.data;
        if (inputemail === "admin@gmail.com" && password === "Admin123") {
          setloggeduser('admin');
          alert("Logged in as admin!");
          navigate("/addproduct")
        } else {
          setstore([...store, userData])
          setloggeduser(userData);
          alert(" User Logged in successfully!");
          navigate("/collection")
        }

      })
      .catch(error => {
        console.error('Login failed:', error);
        setmessage("Login failed. Please check your credentials.");
      });

    try {
      const response = await axios.post('http://localhost:4400/api/user/login', { email: inputemail, password })

      console.log("login", response.data);
      const userData = response.data;
      localStorage.setItem("authToken", response.data.authToken)
      localStorage.setItem("userEmail", response.data.user.email)
      localStorage.setItem("userId", response.data.user._id)
      setstore([...store, userData])
      setloggeduser(userData);
      alert("Login successful!")
      navigate("/collections");

    } catch (error) {
      console.log(error);
    }
  };

  // console.log("logged",loggeduser);


  return (
    <Container className="locontainers d-flex justify-content-center align-items-center vh-100">
      <Row className="w-100">
        <Col md={6} className="d-flex flex-column justify-content-center align-items-center">
          <h3>Login to your account</h3>
          <div className="icons-container my-3">
            <BsFacebook size={20} className="icon" />
            <FaInstagram size={20} className="icon mx-3" />
            <FcGoogle size={20} className="icon" />
          </div>
          <hr className="w-100 my-3 " />
          <p className="text-center w-100">or</p>
          <form className="w-100">
            <InputGroup className="mb-3">
              <InputGroup.Text><GoPerson /></InputGroup.Text>
              <FormControl type="email" placeholder="Enter email here" value={inputemail} onChange={(e) => setinputemail(e.target.value)} />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text><MdLockOpen /></InputGroup.Text>
              <FormControl type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </InputGroup>
            <Button type="button" className="outline w-20" onClick={loginUser}>Login</Button>
          </form>
          {message && <Alert variant="danger" className="mt-3">{message}</Alert>}
        </Col>
        <Col md={6} className="d-flex flex-column justify-content-center align-items-center bg-light p-4">
          <h3>Are you new??</h3>
          <p>Sign up and discover our new collections !!</p>
          <Link to="/register">
            <Button variant="outline" className="mt-2">Sign up</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
}

export default Loginpage;
