import React from 'react';
import { useContext,useState} from 'react';
import { Table } from 'react-bootstrap';
import { Mycontext } from './Newcont';
import { useLocation } from 'react-router-dom';

export default function Buynow() {
  const { productData, cart } = useContext(Mycontext);
  const [form, setForm] = useState({
    name: '',
    address: '',
    email: '',
    area: '',
    pin: '',
    city: '',
    phone: ''
  });
  
  const handleChange = (e) => {
    setForm(e.target.value);
  };

  const handleSave = () => {
    alert('Address saved');
    setForm({
      name: '',
      address: '',
      email: '',
      area: '',
      pin: '',
      city: '',
      phone: ''
    });
  };
  const location = useLocation();
  const product = location.state && location.state.product;


  const cartIds = cart.map((cartItem) => cartItem.id);
  const products = productData.filter((data) => cartIds.includes(data._id.toString()));

  console.log("loc",product);


  return (
    <div className='buynow'>
      <div className='del'>
        <h1>Deliver To:</h1>
        <div className='deli'>
          <div className='delform'>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder='Name' />
            <input type="text"  name="address"value={form.address}onChange={handleChange} placeholder='Address' />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder='Email' />
            <input type="text" name="area" value={form.area} onChange={handleChange} placeholder='Area' />
          </div>
          <div className='delform2'>
            <input type="text" name="pin" value={form.pin} onChange={handleChange} placeholder='Pin' />
            <input type="text" name="city" value={form.city} onChange={handleChange} placeholder='City' />
            <input type="text" name="phone" value={form.phone} onChange={handleChange} placeholder='Phone' />
            <div className='bttn'>
              <button onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      </div>
      <div className='summary'>
      <div className="col-md-8">
          <Table table-light size="sm">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Image</th>
                <th style={{ width: '25%' }}>Name</th>
                <th style={{ width: '25%' }}>Category</th>
                <th style={{ width: '25%' }}>Quantity</th>
                <th style={{ width: '25%' }}>Price</th>

              </tr>
            </thead>
            <tbody>

              {
              product && (<tr>
                <td> <img src={product.image} alt={product.name} style={{ width: '120px', height: '110px' }} /></td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
              </tr>)
              }
            </tbody>
          </Table>
        </div>
      </div>
      <div className='paybtn'>
      <button type="button" class="btn btn-warning">PAY NOW</button>
    </div>
    </div>
  );
}
