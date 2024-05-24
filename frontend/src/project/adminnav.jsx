import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mycontext } from './Newcont';

function Adminnav() {
  const {loggeduser, setloggeduser } = useContext(Mycontext);

  const navigate = useNavigate()
  const handleLogout = () => {
    alert("Logout successful!");
    navigate('/');
  };
  return (
    <header className='sticky-top'>
    <div className='addprotop'>
      <h1>Admin</h1>
      <Link to={"/collections"}>shop</Link>
      <Link to={"/addproduct"}>Add product</Link>
      <Link to={"/productmanage"}>Product Manage</Link>
      <Link to={"/usermanage"}>User Manage</Link>
      <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
    </div>
    </header>
  )
}

export default Adminnav