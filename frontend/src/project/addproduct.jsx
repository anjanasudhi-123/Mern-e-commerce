import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mycontext } from './Newcont';
import './adminnav';
import Adminnav from './adminnav';
import axios from 'axios';

function AddProductForm() {
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImage, setProductImage] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const { Idatas, setIdatas } = useContext(Mycontext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('Product added successfully..');

    try {
      const response = await axios.post('http://localhost:4400/api/admin/items/add', {
        id: productId,
        name: productName,
        category: productCategory,
        image: productImage,
        description: productDescription,
        price: productPrice,
      });

      
      setIdatas([...Idatas, {
        id: productId,
        name: productName,
        category: productCategory,
        image: productImage,
        description: productDescription,
        price: productPrice,
      }]);
      
      setProductId('');
      setProductName('');
      setProductCategory('');
      setProductImage('');
      setProductDescription('');
      setProductPrice('');



      console.log(response.data);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <div>
      <Adminnav />
      <div className='form'>
        <form onSubmit={handleSubmit}>
          <label htmlFor="productId">ID:</label>
          <input type="text" id="productId" value={productId} onChange={(e) => setProductId(e.target.value)} required /><br />

          <label htmlFor="productName">Name:</label>
          <input type="text" id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} required /><br />

          <label htmlFor="productCategory">Category:</label>
          <input type="text" id="productCategory" value={productCategory} onChange={(e) => setProductCategory(e.target.value)} required /><br />

          <label htmlFor="productDescription">Description:</label>
          <input type="text" id="productDescription" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} required /><br />

          <label htmlFor="productPrice">Price:</label>
          <input type="text" id="productPrice" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} required /><br />

          <label htmlFor="productImage">Image:</label>
          <input type="text" id="productImage" value={productImage} onChange={(e) => setProductImage(e.target.value)} required /><br />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddProductForm;