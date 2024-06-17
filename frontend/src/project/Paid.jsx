// paid

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function Paid() {
  const location = useLocation();
  const { deliveryaddress, payable,orderData} = location.state
  // const {totalAmount}=location.state
  const { product } = location.state
  // const [payable, setPayable] = useState(totalAmount);
  console.log("totalAmount", payable);

  const valueText = `Proceed to payment of ₹${payable} through Payment Gateway ->`;
  console.log('amountPayable', payable);

  const makePayment = async (e) => {
    e.preventDefault();
    const jsonPayload = {
      amount: payable * 100,
      currency: 'INR',
      receipt: 'receipt#1',
    };

    try {
      const response = await axios.post(`http://localhost:4400/api/user/makepayment`, jsonPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('payment response:', response.data);
      const options = {
        key: 'rzp_test_JorS0iNRvZWc0T',
        amount: payable * 100,
        currency: 'INR',
        name: 'LuxeHaven',
        description: 'Product will be delivered soon!',
        handler: async function (response) {
          const body = {
            ...response,
          };
          const validate = await axios.post(`http://localhost:4400/api/user/validatepayment`, body, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
          console.log(validate.data);
        },
        prefill: {
          name: "Anjana",
          email: "anjana@gmail.com",
          phone: 66787788888,
        },
        notes: {
          address: "Kadavanthra,",
        },
        theme: {
          color: '#4D869C',
        },
      };
      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp1.open();
    } catch (error) {
      console.error('Error making payment:', error);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <button style={{ borderRadius: '5px' }} onClick={makePayment}>
        {valueText}
      </button>
    </div>
  );
}

export default Paid;
