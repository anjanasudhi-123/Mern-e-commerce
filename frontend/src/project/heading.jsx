import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mycontext } from './Newcont';
import './nav.css';

function Heading() {
    const { cart, likeitem } = useContext(Mycontext);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [likeitemcount, setLikeItemCount] = useState(0);
    const navigate = useNavigate();
    const authToken = localStorage.getItem("authToken");

    useEffect(() => {
        setCartItemCount(cart.length);
    }, [cart]);

    useEffect(() => {
        setLikeItemCount(likeitem.length);
    }, [likeitem]);

    function home() {
        navigate('/collections');
    }

    const handleLogout = () => {
        localStorage.removeItem("userEmail");
        localStorage.removeItem("authToken");
        alert("Logout successful!");
        navigate('/');
        window.location.reload();
    };

    return (
        <header className='sticky-top'>
            <div className='top'>
                <h1 className="class" onClick={home}>LuxeHaven</h1>
                <div className='logo'>
                    <Link to={'/vieworders'} className="nav-link">ORDERS</Link>
                    <Link to={"/like"} className="nav-link">LIKE {likeitemcount > 0 && <span className="like-item-count">{likeitemcount}</span>}</Link>
                    <Link to={"/Pcart"} className="nav-link">CART {cartItemCount > 0 && <span className="cart-item-count">{cartItemCount}</span>}</Link>
                    {authToken ? (
                        <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
                    ) : (
                        <Link to={"/login"} className="btn btn-outline-success">Login</Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Heading;
