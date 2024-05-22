import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './nav.css';
import { Mycontext } from './Newcont';
import Adminnav from './adminnav';
import axios from 'axios';

function Productmanage() {
    const { Idatas, setIdatas } = useContext(Mycontext);
    const [formData, setFormData] = useState({
        productId: '',
        productName: '',
        productCategory: '',
        productImage: '',
        productDescription: '',
        productPrice: ''
    });
    const [editItemId, setEditItemId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        axios.get('http://localhost:4400/api/admin/items/get')
            .then(response => {
                setIdatas(response.data.allProducts);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    };

    function editItem(item) {
        setFormData({
            productId: item._id,
            productName: item.name,
            productCategory: item.category,
            productImage: item.image,
            productDescription: item.description,
            productPrice: item.price
        });
        setEditItemId(item._id);
    }
    function saveEditedItem(e) {
        e.preventDefault();
        alert("Updated successfully");
    
        const updatedItemData = {
            id: formData.productId,
            name: formData.productName,
            category: formData.productCategory,
            image: formData.productImage,
            description: formData.productDescription,
            price: formData.productPrice
        };
    
        axios.post(`http://localhost:4400/api/admin/items/edit/${editItemId}`, updatedItemData)
            .then(response => {
                console.log(response.data);
                fetchProducts(); 
                clearFormData();
            })
            .catch(error => {
                console.error('Error updating product:', error);
            });
    }
        
    function deleteItem(id) {
        axios.delete(`http://localhost:4400/api/admin/items/delete/${id}`)
            .then(response => {
                console.log(response.data);
                fetchProducts(); 
            })
            .catch(error => {
                console.error('Error deleting product:', error);
            });
    }
    

    function clearFormData() {
        setFormData({
            productId: '',
            productName: '',
            productCategory: '',
            productImage: '',
            productDescription: '',
            productPrice: ''
        });
    }

    return (
        <header>
            <Adminnav />
            <div className='forms'>
                <form onSubmit={saveEditedItem}>
                    <label htmlFor="productId">ID:</label>
                    <input type="text" id="productId" value={formData.productId} onChange={(e) => setFormData({ ...formData, productId: e.target.value })} required />

                    <label htmlFor="productName">Name:</label>
                    <input type="text" id="productName" value={formData.productName} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} required />

                    <label htmlFor="productCategory">Category:</label>
                    <input type="text" id="productCategory" value={formData.productCategory} onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })} required />

                    <label htmlFor="productDescription">Description:</label>
                    <input type="text" id="productDescription" value={formData.productDescription} onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })} required />

                    <label htmlFor="productPrice">Price:</label>
                    <input type="text" id="productPrice" value={formData.productPrice} onChange={(e) => setFormData({ ...formData, productPrice: e.target.value })} required />

                    <label htmlFor="productImage">Image:</label>
                    <input type="text" id="productImage" value={formData.productImage} onChange={(e) => setFormData({ ...formData, productImage: e.target.value })} required /><br />

                    <button type="submit">{editItemId ? 'Save' : 'Submit'}</button>
                </form>
            </div>

            {Idatas.map((item, index) => (
                <div className='pritem' key={index}>
                    <img src={item.image} alt="img" width="400px" height="300px" /><br />
                    <div className='item-1'>
                        <h2>{item.name}</h2>
                        <p>{item.category}</p>
                        <p>{item.description}</p>
                        <p>₹{item.price}</p>
                    </div>
                    <button onClick={() => editItem(item)}>Edit</button>
                    <button onClick={() => deleteItem(item._id)}>Delete</button>
                </div>
            ))}
        </header>
    );
}

export default Productmanage;