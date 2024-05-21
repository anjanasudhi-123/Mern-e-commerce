const express = require('express')
const router = express.Router()
const usercontrol = require('../controller/usercontrol')

router.post('/register',usercontrol.createuser)
router.post('/login',usercontrol.loginuser)


router.post('/addtocart',usercontrol.addToCart)
router.post('/cartdata',usercontrol.cartData)
router.post('/updatecart',usercontrol.updateCart)

router.post('/removeFromcart',usercontrol.uncartItem)
router.post('/addquantity',usercontrol.addQuantity)
router.post('/removequantity',usercontrol.removeQuantity)

router.post('/like', usercontrol.likeItem);
router.post('/likedata',usercontrol.likeData)
router.post('/updatelike',usercontrol.updatelike)
router.post('/unlike',usercontrol.unlikeItem)

module.exports = router

