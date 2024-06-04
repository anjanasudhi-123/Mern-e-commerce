import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import usericon from './svg/user-solid.svg';
import hearticon from './svg/heart-regular.svg';
import carticon from './svg/cart-shopping-solid.svg';
import { Mycontext } from './Newcont';
import './nav.css';

function Heading() {
    const { cart, setCart, loggeduser, setloggeduser, likeitem, setLikeitem } = useContext(Mycontext);
    const [cartItemCount, setCartItemCount] = useState(0);
    const[likeitemcount,setlikeitemcount]=useState(0)
    const navigate = useNavigate();
    const authToken = localStorage.getItem("authToken");

    useEffect(() => {
        setCartItemCount(cart.length);
    }, [cart]);

     useEffect(()=>{
        setlikeitemcount(likeitem.length)
     },[likeitem])


    function home (){
        navigate('/collections')
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
                <h1 classname="class" onClick={home}>LuxeHaven</h1>
                <div className='logo'>
                    
                <Link to={"/like"}>
                        <div className="like-icon-container">
                            <img src={hearticon} alt="like" />
                            {likeitemcount > 0 && <span className="like-item-count">{likeitemcount}</span>}
                        </div>
                    </Link>
                    <Link to={'/vieworders'}>orders</Link>
                    <Link to={"/Pcart"}>
                        <div className="cart-icon-container">
                            <img src={carticon} alt="cart" />
                            {cartItemCount > 0 && <span className="cart-item-count">{cartItemCount}</span>}
                        </div>
                    </Link>
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
