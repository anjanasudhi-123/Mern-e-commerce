import React from 'react';
import { Table } from 'react-bootstrap';
import { useContext } from 'react';
import { Mycontext } from "./Newcont";

function Payment() {
  const { productData, cart } = useContext(Mycontext);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
  };

  const cartIds = cart.map((cartItem) => cartItem.id);
  const products = productData.filter((data) => cartIds.includes(data._id.toString()));

  return (
    <div className="pay">
      <h2>Order summary</h2>
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
      <div className="row">
        <div className="col-md-8">
          <Table table-light size="sm">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Image</th>
                <th style={{ width: '25%' }}>Name</th>
                <th style={{ width: '25%' }}>Price</th>
                <th style={{ width: '25%' }}>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item._id}>
                  <td><img src={item.image} alt={item.name} style={{ width: '50px', height: '50px' }} /></td>
                  <td>{item.name}</td>
                  <td>₹{item.price}</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="row">
        <div className="col-md-8">
          <h4>Total Amount: ₹{calculateTotal()}</h4>
        </div>
        <div className="col-md-4">
        <div class='pay'>
          <h1>Payment Method</h1>
          <div class="payment-options">
            <input type="radio" id="netBanking" name="paymentMethod" value="Net Banking" />
            <label for="netBanking">Net Banking</label>
            <input type="radio" id="UPI" name="paymentMethod" value="UPI" />
            <label for="UPI">UPI</label>
            <input type="radio" id="cashOnDelivery" name="paymentMethod" value="Cash on Delivery" />
            <label for="cashOnDelivery">Cash on Delivery</label>
            <input type="radio" id="creditDebitCard" name="paymentMethod" value="Credit/Debit/ATM Card" />
            <label for="creditDebitCard">Credit/Debit/ATM Card</label>
          </div>
        </div>
</div>
      </div>
    </div>
  );
}

export default Payment;

