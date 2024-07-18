
const express = require('express');
const router = express.Router();
const adminControl = require('../controller/admincontrol');
const { MdRouter } = require('react-icons/md');

router.get('/items/get', adminControl.getProducts);
router.post('/items/add',adminControl.addProduct)
router.post('/items/edit/:id', adminControl.updateProduct);
router.delete('/items/delete/:id', adminControl.deleteProduct);

router.get('/login/get',adminControl.Getuser)
router.post('/login/ban/:id', adminControl.BanUser);
router.get('/login/unban/:id', adminControl.UnBanUser);
router.get('/login/delete/:id', adminControl.DeleteUser);
router.post('/login/getAllOrders',adminControl.getAllOrders)

module.exports = router