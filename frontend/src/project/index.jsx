import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import usericon from './svg/user-solid.svg'
import hearticon from './svg/heart-regular.svg'
import carticon from './svg/cart-shopping-solid.svg'
import { Mycontext } from './Newcont';
import './heading'
import Heading from './heading';


function Frontpage() {
     const { Idatas, cart, setCart } = useContext(Mycontext)
     const [filtereditems, setfiltereditems] = useState(Idatas)
     const [cartItemCount, setCartItemCount] = useState(0);




     return (
          <header>
               <Heading />

               <div className='topimage'>
                    <div class='slide'>
                         <img src="https://www.sliderrevolution.com/wp-content/uploads/revslider/fashion3.jpg" alt="Image 1"></img>
                    </div>
                    <div className='top-button'>
                         <Link to={"/collections"}>SHOP NOW</Link>
                    </div>
               </div>
               <h4></h4>
               <div className='images'>
                    <div className="image-container">
                         <Link to="/handbag">
                              <img src="https://images-static.nykaa.com/uploads/d88abb25-27ba-4e7c-9df7-2d17bd05b90d.jpg?tr=w-240,cm-pad_resize" alt="Description 2" />
                         </Link>
                         <p>HAND BAGS</p>
                    </div>
                    <div className="image-container">
                         <Link to="/footwear">
                              <img src="https://images-static.nykaa.com/uploads/7aa678a4-e50d-4fd2-ba0c-cf24018f8af3.jpg?tr=w-240,cm-pad_resize" alt="Description 3" />
                         </Link>
                         <p>FOOTWEARS</p>
                    </div>
                    <div className="image-container">
                         <Link to="/outwear">
                              <img src="https://adn-static1.nykaa.com/nykdesignstudio-images/pub/media/catalog/product/9/3/tr:w-250,/9304ae15452775102604_1.jpg?rnd=20200526195200" alt="Description 3" />
                         </Link>
                         <p>COATS & OUTWEAR</p>
                    </div>

               </div>
               <footer className="footer bg-black text-white py-4">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <h5 className="text-uppercase">LuxeHaven</h5>
                        <p>
                            Welcome to LuxeHaven,
                             your ultimate destination for luxury shopping. 
                        </p>
                    </div>
                    <div className="col-md-4">
                        <h5 className="text-uppercase">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li><a href="/aboutus" className="text-white">About Us</a></li>
                            <li><a href="/customercare" className="text-white">Customer Care</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h5 className="text-uppercase">Contact Information</h5>
                        <ul className="list-unstyled">
                            <li>LuxeHaven@gmail.com</li>
                            <li>9900887766</li>
                            <li>Kochi, Kerala</li>
                        </ul>
                    </div>
                </div>
            </div>
           <div className="text-center p-3 bg-black text-white" style={{ backgroundColor: 'blue' }}>
    © 2024 LuxeHaven. All Rights Reserved.
</div>

        </footer>
          </header>
     )
}
export default Frontpage;


