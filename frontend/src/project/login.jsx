import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mycontext } from "./Newcont";
import axios from 'axios'

function Loginpage() {
  const [inputemail, setinputemail] = useState("");
  const [password, setPassword] = useState("");
  const { store, loggeduser, setloggeduser, cart, setCart, setLikeitem, likeitem, logoutUser, setlogoutUser, blockUser, setblockUser, bannedUsers,
                                                                   setBannedUsers, ban, setban,setstore} = useContext(Mycontext);
  const [message, setmessage] = useState("");
  const [logoutUserState, setLogoutUser] = useState(false);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (logoutUserState) {
  //     handleLogout();
  //   }
  // }, [logoutUserState]);

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
          setstore([...store,userData])
          setloggeduser(userData);
          alert(" User Logged in successfully!");
          navigate("/")
        }
        
      })
      .catch(error => {
        console.error('Login failed:', error);
        setmessage("Login failed. Please check your credentials.");
      });

      try {
       const response= await axios.post('http://localhost:4400/api/user/login', { email: inputemail, password })

       console.log("login",response.data);
       const userData = response.data; 
       localStorage.setItem("authToken",response.data.authToken)
       localStorage.setItem("userEmail",response.data.user.email)
       localStorage.setItem("userId",response.data.user._id)
       setstore([...store,userData])
          setloggeduser(userData);
          // alert("Login successful!")
       navigate("/");

      } catch (error) {
        console.log(error);
      }
  };

  // console.log("logged",loggeduser);

  return (
    <div className="containers">
      <div className="login">
        <h1>Login </h1><br></br>
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
        <button type="button" className="btn btn-primary" onClick={loginUser}>Login</button>

        <p>
          Don't have an account? <Link to={"/register"}>Register here</Link>
        </p>
        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
}

export default Loginpage;