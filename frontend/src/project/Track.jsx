import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios'; 
import './nav.css';
import { Link } from 'react-router-dom';



const Track = () => {
  const { orderId } = useParams(); 
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:4400/api/user/trackorder/${orderId}`);
        setTrackingInfo(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrackingInfo();
  }, [orderId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='track'>
      <div className='btnback'>
          <Link to="/vieworders" className="btn btn-outline-secondary">Back</Link>
        </div>
      <h1>TRACK YOUR ORDER</h1>
      <h2>Order ID: {trackingInfo.orderId}</h2>
      <img src="https://miro.medium.com/v2/resize:fit:2000/0*O8GfPtggZCun7Zie.jpeg" alt="Tracking" style={{ width: '80%', height: 'auto' }} />
      {trackingInfo ? (
        <div className='tracknow'>
          <p>Status : {trackingInfo.status}</p>
          <p>Estimated Delivery : {trackingInfo.estimatedDelivery}</p>
        </div>
      ) : (
        <div>No tracking information found.</div>
      )}
    </div>
  );
};

export default Track;
