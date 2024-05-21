import React from 'react';
import { useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mycontext } from "./Newcont";



export default function Buynow() {
  const { productData, cart, setCart } = useContext(Mycontext);

  const cartIds = cart.map((cartItem) => cartItem.id);
  const products = productData.filter((data) => cartIds.includes(data._id.toString()));
  console.log("pr", products);





  
  return (
    <div className='buynow'>
      <div className='del'>
        <h1>Deliver To:</h1>
        <div className='deli'>
          <div className='delform'>
            <input type="text" placeholder='Name' />
            <input type="text" placeholder='Address' />
            <input type="email" placeholder='Email' />
            <input type="text" placeholder='Area' />
          </div>
          <div className='delform2'>
            <input type="text" placeholder='Pin' />
            <input type="text" placeholder='City' />
            <input type="text" placeholder='Phone' />
            <div className='bttn'>
              <button>Save</button>
            </div>
          </div>
        </div>
      </div>
      <div className='summary'>
        <h1>Order Summary</h1>
        <div className='orsum'>
          <tbody>
            {products.map((item)=>{
              <tr key={item.id}>
                 <td>
                      <img src={item.image} alt={item.name} style={{ width: '120px', height: '110px' }} />
                    </td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>₹{item.price}</td>
              </tr>
            })}
          </tbody>
        </div>
      </div>
    </div>
  );
}
