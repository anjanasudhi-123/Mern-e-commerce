
import './App.css';
import { Mycontext } from './project/Newcont';
// import { ProductDatas } from './component/Datas';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'

import { itemdatas } from './project/items';
import { BrowserRouter, Routes, Route } from 'react-router-dom';






import { useEffect, useState } from 'react';


import Like from './project/like';
import Login from './project/login';
import Registerpage from './project/register';
import Navbar from './project/collection';
import Frontpage from './project/index';
import Handbag from './project/handbag';
import Footwear from './project/footwear';
import Addproductform from './project/addproduct';
import Productmanage from './project/productmanage'
import Usermanage from './project/usermanage';
import Heading from './project/heading';
import Adminnav from './project/adminnav';
import Outwear from './project/outwear';
import Pcart from './project/Pcart';
import AboutUs from './project/AboutUs';
import Buynow from './project/buynow';
import Customercare from './project/customercare';
import Payment from './project/payment';
import Paid from './project/Paid';
import Vieworders from './project/vieworders';
import Adminorder from './project/adminorder';
import Track from './project/Track';





function App() {


  // const [pData, setPData] = useState(ProductDatas)
  const [likeProduct, setLikeProduct] = useState([])
  const [addcart, setaddcart] = useState([])
  const [numproducts, setnumproducts] = useState();
  const [cost, setcost] = useState();
  const [cart, setCart] = useState([])
  const [like, setlike] = useState([])
  // console.log("cart",cart);

  const [name, setname] = useState()
  const [pass, setPass] = useState()
  const [store, setstore] = useState([])
  const [loguser, setloguser] = useState([])
  const [inputemail, setinputemail] = useState("")
  const [password, setPassword] = useState("")


  const [email, setemail] = useState("")
  const [message, setmessage] = useState("")
  // const [filterduser, setfiltereduser] = useState(pData)



  const [Idatas, setIdatas] = useState([])
  // const [filtereditems, setfiltereditems] = useState(Idatas)
  const [searchitems, setsearchitems] = useState('')
  const [likeitem, setLikeitem] = useState([])
  const [userloggedin, setuserloggedin] = useState(false);
  const [usercartin, setcartin] = useState(false);
  const [loggeduser, setloggeduser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [blockUser, setblockUser] = useState([])
  const [block, setblock] = useState([])
  const [bannedUsers, setBannedUsers] = useState([]);
  const [ban, setban] = useState([])
  const [productData, setProductData] = useState([])

  const { payable, setPayable } = useState()


  const getProductData = async () => {
    try {
      const response = await axios.get("http://localhost:4400/api/admin/items/get")
      console.log("new", response.data.allProducts)
      setProductData(response.data.allProducts)
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getProductData()
  }, [setProductData])

  const values = {
    // pData, setPData, 
    likeProduct, setLikeProduct, addcart, setaddcart, numproducts, setnumproducts, cost, setcost, cart, setCart,
    store, setstore, loguser, setloguser, pass, setPass, inputemail, setinputemail, password, setPassword, name, setname, email, setemail,
    message, setmessage, searchitems, setsearchitems
    , Idatas, setIdatas, likeitem, setLikeitem, userloggedin, setuserloggedin, usercartin, setcartin, loggeduser, setloggeduser, ban, setban, productData, setProductData,
    like, setlike, payable, setPayable
  }
  return (
    <div className="App">
      {/* <Factor/> */}

      <BrowserRouter>
        <Mycontext.Provider value={values}>
          <Routes>

            <Route path="/" element={<Frontpage />} />
            <Route path="/collections" element={<Navbar />} />
            <Route path="/handbag" element={<Handbag />} />
            <Route path="/footwear" element={<Footwear />} />
            <Route path="/addproduct" element={<Addproductform />} />
            <Route path="/productmanage" element={<Productmanage />} />
            <Route path="/usermanage" element={< Usermanage />} />
            <Route path="/heading" element={<Heading />} />
            <Route path="/adminnav" element={<Adminnav />} />
            <Route path="/like" element={<Like />} />
            <Route path="/Outwear" element={<Outwear />} />
            <Route path="/Pcart" element={<Pcart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registerpage />} />
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route path="/customercare" element={<Customercare />} />
            <Route path="/buynow" element={<Buynow />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/Paid" element={<Paid />} />
            <Route path="/vieworders" element={<Vieworders/>}/>
            <Route path="/adminorder" element={<Adminorder/>}/>
            <Route path="/Track/:orderId" element={<Track/>}/>


          </Routes>
        </Mycontext.Provider>
      </BrowserRouter>


    </div>
  );
}


export default App;
