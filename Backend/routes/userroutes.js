const express = require('express')
const router = express.Router()
const usercontrol = require('../controller/usercontrol')

router.post('/register', usercontrol.createuser)
router.post('/login', usercontrol.loginuser)


router.post('/addtocart', usercontrol.addToCart)
router.post('/cartdata', usercontrol.cartData)
router.post('/updatecart', usercontrol.updateCart)

router.post('/removeFromcart', usercontrol.uncartItem)
router.post('/addquantity', usercontrol.addQuantity)
router.post('/removequantity', usercontrol.removeQuantity)

router.post('/like', usercontrol.likeItem);
router.post('/likedata', usercontrol.likeData)
router.post('/updatelike', usercontrol.updatelike)
router.post('/unlike', usercontrol.unlikeItem)

router.post('/makepayment', usercontrol.makePayment)
router.post('/validatepayment', usercontrol.Validatepayment)

router.post('/addaddress', usercontrol.addAddress)
router.post('/getaddress', usercontrol.getAddress)
router.post('/updateaddress', usercontrol.updateAddress)
router.delete('/deleteaddress', usercontrol.deleteAddress)

// router.post('/ordersummary', usercontrol.orderSummery)
// router.get('/getsummary', usercontrol.getSummary)
router.post('/saveorder', usercontrol.saveOrder)
router.post('/getorder',usercontrol.getOrder)



module.exports = router

