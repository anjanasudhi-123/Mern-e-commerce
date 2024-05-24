import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mycontext } from "./Newcont";
import { useNavigate } from 'react-router-dom';
import './nav.css'
import axios from 'axios'

function Registerpage() {
    const [inputemail, setinputemail] = useState("");
    const [password, setPassword] = useState("");
    const { store, setstore } = useContext(Mycontext);
    const { loguser, setloguser } = useContext(Mycontext);
    const [email, setemail] = useState("");
    const [message, setmessage] = useState("");
    const navigate = useNavigate()

    const emailvalidation = () => {
        const refer = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if (refer.test(email)) {
            alert("Email is valid");
        } else {
            alert("Please enter a valid email!");
        }
    };
    const StrongPassword = (password) => {
        if (!password) return false;
        const pattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
        return pattern.test(password);
    };


    const Add = () => {
        const refer = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if (!refer.test(inputemail)) {
            alert("Please enter a valid email!");
            return;
        }
        if (!StrongPassword(password)) {
            alert("Please use a strong password (at least 8 characters with first letter capital..)!");
            return;
        }

        axios.post('http://localhost:4400/api/user/register', { email: inputemail, password })
        .then(response => {
            console.log(response.data);
            if (response.data.success) {
                alert("Successfully registered");
                setinputemail("");
                setPassword("");
                navigate("/login");
            } else {
                alert("Registration failed");
            }
        })
        .catch(error => {
            console.error('Error registering:', error);
            alert("An error occurred during registration");
        });
};



    return (
        
        <div className="containers">
            <div className="reg">
                <h1>Register  </h1><br></br>
                <input
                    type="email"
                    placeholder="Enter email here"
                    value={inputemail}
                    onChange={(e) => setinputemail(e.target.value)}
                />
                <br></br>
                <br></br>
                <input
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br></br>
                <br></br>
                <button type="button" class="btn btn-primary" onClick={Add}>
                    Register
                </button>
                <p>
                    Account already exists! <Link to={"/login"}>Login here</Link>
                </p>
            </div>
        </div>
        
    );
}


export default Registerpage;