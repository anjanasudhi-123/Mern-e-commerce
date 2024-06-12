import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './nav.css';
import { Mycontext } from './Newcont';
import Adminnav from './adminnav';
import axios from 'axios';

function Productmanage() {
    const { Idatas, setIdatas,setProductData,productData } = useContext(Mycontext);
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
                setProductData(response.data.allProducts)
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
                alert('Deleted successfully !')
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
        setEditItemId(null);
    }

    return (
        <header>
            <Adminnav />
            <div className='deli'>
                <form className='delform' onSubmit={saveEditedItem}>
                    <input type="text" id="productId"  placeholder="productId" value={formData.productId} onChange={(e) => setFormData({ ...formData, productId: e.target.value })} required />
                    <input type="text" id="productName"   placeholder="productName" value={formData.productName} onChange={(e) => setFormData({ ...formData, productName: e.target.value })} required />
                    <input type="text" id="productCategory"  placeholder="productCategory"  value={formData.productCategory} onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })} required />
                    <input type="text" id="productDescription"  placeholder="productDescription" value={formData.productDescription} onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })} required />
                    <input type="text" id="productPrice"  placeholder="productPrice"  value={formData.productPrice} onChange={(e) => setFormData({ ...formData, productPrice: e.target.value })} required />
                    <input type="text" id="productImage"  placeholder="productImage"  value={formData.productImage} onChange={(e) => setFormData({ ...formData, productImage: e.target.value })} required /><br />
                    <div className='bttn'>
                        <button type="submit">{editItemId ? 'Save' : 'Submit'}</button>
                    </div>
                </form>
            </div>

            <div className="row">
                    {Idatas.map((item, index) => (
                        <div className="col-md-2 " key={index}>
                            <div className="card">
                                <img src={item.image} className="card-img-top" alt={item.name} />
                                <div className="card-body">
                                    <h5 className="card-title">{item.name}</h5>
                                    <p className="card-text">{item.category}</p>
                                    <p className="card-text">{item.description}</p>
                                    <p className="card-text">₹{item.price}</p>
                                    <button className="btn btn-light mr-2" onClick={() => editItem(item)}>Edit</button>
                                    <button className="btn btn-light" onClick={() => deleteItem(item._id)}>Delete</button>
                                </div>
                            </div>
                        </div>
            ))}
            </div>
        </header>
    );
}

export default Productmanage;
