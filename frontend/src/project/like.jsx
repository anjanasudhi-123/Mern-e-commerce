import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Mycontext } from "./Newcont";
import usericon from './svg/user-solid.svg'
import hearticon from './svg/heart-regular.svg'
import carticon from './svg/cart-shopping-solid.svg'
import cartin from './svg/cart-arrow-down-solid.svg'
import likeheart from './svg/likeheart-solid.svg'
import HomeIcon from './svg/home.svg';
import Heading from './heading';
import axios from 'axios';
import { useFetchCart } from './useFetchCart';
import { useFetchLike } from "./usefetchLike";


function Like() {
  const {productData,likeitem, setLikeitem} = useContext(Mycontext)
  console.log("likeditems" + likeitem)
  const navigate=useNavigate()
  const [cartItemCount, setCartItemCount] = useState(0);
  const userEmail = localStorage.getItem("userEmail")
  const authToken = localStorage.getItem("authToken");


const {like,setLike}=useFetchLike(userEmail)

  useEffect(() => {
    if (userEmail) {
      fetchLike();
    }
  }, [setLikeitem]);



  const cart = useFetchCart(userEmail).cart
  useEffect(() => {
      setCartItemCount(cart.length);
  }, [cart]);




  const fetchLike = async () => {
    try {
      const response = await axios.post("http://localhost:4400/api/user/likedata", {email:userEmail})
        setLikeitem(response.data.like)
        console.log("fetching like data", response.data.like);
      
    } catch (error) {
      console.log("error fetching like data:", error);
    }
  };
  


                                                                                                 
  async function cartbtn(item) {
    const authToken = localStorage.getItem("authToken");
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
            // Handle error
        }
    } else {
        alert("Please log in to add/remove items from the cart!");
        navigate("/login");
    }
}

const unlikeBtn = async (id) => {
  try {
    console.log("Attempting to remove item with Id:", id);
    const response = await axios.post("http://localhost:4400/api/user/unlike", {
      email: userEmail,
      id: id,
    });
    console.log("removing item:", response.data);
    if (response.data.success) {
      const updatedLikeItems = like.filter((likeditem) => likeditem.id !== id);
      console.log("updated like after unlike", updatedLikeItems);
      setLikeitem(updatedLikeItems);
    } else {
      console.log("failed to unlike:", response.data.error);
    }
  } catch (error) {
    console.log("Error in unliking item:", error);
  }
};


  const likeIds = like.map((likeItem) => likeItem.id);
  const products=productData.filter((data)=>likeIds.includes(data._id.toString()))
console.log("pro",products,likeIds)


  return (
    <header>
      <Heading />

      {like.length === 0 && (
        <h2>No items found !!</h2>
      )}
      {like.length > 0 && (
        <>
          {
            products.map((dat) => (
              <div className="liked">
                <img src={dat.image} alt="img" width="300px" height="400px" />
                <div className="liked1">
                  <h2>{dat.name}</h2>
                  <p>{dat.category}</p>
                  <p>{dat.description}</p>
                  <p>₹{dat.price}</p>
                </div>
                <div className="likebutton">
                <button onClick={() => cartbtn(dat)} style={{ border: "none", background: "transparent" }}>
                                    {cart.some(cartItem => cartItem.id === dat._id) ?
                                        <img src={carticon} alt='cart' style={{ width: '20px', height: '20px' }} /> :
                                        <img src={cartin} alt='' style={{ width: '20px', height: '20px' }} />}
                                </button>
                  <button onClick={() => unlikeBtn(dat._id)} style={{ border: "none", background: "transparent" }}>
                    <img src={likeheart} alt="heart" style={{ width: '20px', height: '20px' }} />
                  </button>
                </div>
              </div>

            )

            )}
        </>
      )}
    </header>
  )

}
export default Like;