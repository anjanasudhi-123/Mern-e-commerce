import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './nav.css'
import { itemdatas } from './items'
import { Mycontext } from './Newcont';
import carticon from './svg/cart-shopping-solid.svg'
import magnifyingicon from './svg/magnifying-glass-solid copy.svg'
import usericon from './svg/user-solid.svg'
import hearticon from './svg/heart-regular.svg'
import likeheart from './svg/likeheart-solid.svg'
import cartin from './svg/cart-arrow-down-solid.svg'
import Heading from './heading';
import axios from 'axios';
import { useFetchCart } from './useFetchCart';
import { useFetchLike } from './usefetchLike';

function Navbar(props) {
    const { Idatas, setIdatas, likeitem, setLikeitem, addcart, setaddcart, loggeduser, setloggeduser, productData, setProductData, } = useContext(Mycontext)
    
    const [filtereditems, setfiltereditems] = useState(Idatas)
    const [searchitems, setsearchitems] = useState('')
    const [userloggedin, setuserloggedin] = useState(false);
    const [usercartin, setcartin] = useState(false);
    const navigate = useNavigate()
    const [cartItemCount, setCartItemCount] = useState(0);

    const userEmail = localStorage.getItem("userEmail")
    const authToken = localStorage.getItem("authToken");

    const { like, setLike } = useFetchLike(userEmail);
    const { cart, setCart } = useFetchCart(userEmail);

    useEffect(() => {
        setCartItemCount(cart.length);
    }, [cart]);

    console.log(props.item);
    const nav = useNavigate()
    console.log("data", Idatas)

    console.log("like",like);

    async function Likebtn(item) {
        if (authToken) {
            const Isitemlike = like.some(likeItem => likeItem.id === item._id);
            if (Isitemlike) {
                alert("already exist!");
                return;
            }
            try {
                const requestData = {
                    email: userEmail,
                    id: item._id,
                    quantity: 1
                };
                const response = await axios.post(`http://localhost:4400/api/user/like`, requestData);
                // console.log("likeres", response.data.user.like);
                // setLike(response.data.user.like); 
                alert("product liked!");
            } catch (error) {
                console.log(error);
            }
        } else {
            alert("Please log in to like/unlike items !");
            navigate("/login");
        }
    }

    async function cartbtn(item) {
        if (authToken) {
            const isItemInCart = cart.some(cartItem => cartItem.id === item._id);
            if (isItemInCart) {
                alert("Already exist!");
                return;
            }
            try {
                const requestData = {
                    email: userEmail,
                    id: item._id,
                    quantity: 1
                };
                const response = await axios.post(`http://localhost:4400/api/user/addtocart`, requestData);
                // setCart(response.data.user.cart); 
                console.log("cartres", response.data.user.cart);
                alert("Product added to cart successfully!");
            } catch (error) {
                console.log(error);
            }
        } else {
            alert("Please log in to add/remove items from the cart!");
            navigate("/login");
        }
    }

    function handleitemsearch(e) {
        const query = e.target.value
        setsearchitems(query)
        const filtered = filtereditems.filter((user) => {
            const { name, category, description } = user
            console.log('Name:', name);
            console.log('Category:', category);
            console.log('Description:', description);
            return (
                name.toLowerCase().includes(query.toLowerCase()) ||
                category.toLowerCase().includes(query.toLowerCase()) ||
                description.toLowerCase().includes(query.toLowerCase())
            )
        })
        setfiltereditems(filtered)
    }

    console.log("collkp", like, cart, productData);

    return (
        <header>
            <Heading />
            <div>
                <h3>OUR COLLECTIONS</h3>
            </div>
            <div className='search'>
                <input type="textfield" placeholder="search.." onChange={handleitemsearch} width={"20%"} />
            </div>
            <>
                {
                    productData.map((ite) => (
                        <div className='item'>
                            <img src={ite.image} alt="img" width="400px" height="300px" /><br></br>
                            <div className='item-1'>
                                <h2>{ite.name}</h2>
                                <p>{ite.category}</p>
                                <p>{ite.description}</p>
                                <p>₹{ite.price}</p>
                            </div>
                            <div className='item-1 button'>
                                <button onClick={() => Likebtn(ite)} style={{ border: "none", background: "transparent" }}>
                                    {like.find(likeItem => likeItem.id === ite._id) ?
                                        <img src={likeheart} alt='like' style={{ width: '20px', height: '20px' }} /> :
                                        <img src={hearticon} alt='' style={{ width: '20px', height: '20px' }} />}
                                </button>
                                <button onClick={() => cartbtn(ite)} style={{ border: "none", background: "transparent" }}>
                                    {cart.some(cartItem => cartItem.id === ite._id) ?
                                        <img src={carticon} alt='cart' style={{ width: '20px', height: '20px' }} /> :
                                        <img src={cartin} alt='' style={{ width: '20px', height: '20px' }} />}
                                </button>
                            </div>
                        </div>
                    ))}
            </>
        </header>
    )
}
export default Navbar;
