const { User } = require('../models/usermodel')
const Product = require('../models/productmodel')
const Order = require('../models/summarymodel')

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const Razorpay = require('razorpay')
const jwtSecretKey = "plmn123"


const createuser = async (req, res) => {
    let hashedpassword = await bcrypt.hash(req.body.password, 10)
    try {
        // await User.create({
        //     email:req.body.email,
        //     password:hashedpassword
        // })

        const user = new User({ email: req.body.email, password: hashedpassword })
        await user.save()
        res.json({ success: true })
    } catch (error) {
        console.log(error)
        res.json({ success: false })
    }
}



const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === "admin@gmail.com" && password === "Admin123") {
            // const authToken = jwt.sign({ email }, jwtSecretKey);
            return res.json({ success: true, alert: "admin loggin successfully" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found", success: false });
        }
        if (user.isBanned) {
            return res.status(403).json({ error: "User is banned", success: false });
        }
        const comparepwd = await bcrypt.compare(password, user.password);
        if (comparepwd) {
            const authToken = jwt.sign({ email }, jwtSecretKey);
            return res.json({ success: true, authToken, user, isAdmin: false });
        } else {
            return res.status(400).json({ error: "Incorrect password", success: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "An error occurred" });
    }
};

const addToCart = async (req, res) => {
    try {
        const { email, id, quantity } = req.body;

        if (!email || !id || !quantity) {
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        const existingItem = user.cart.find(item => item.id === id);

        if (existingItem) {

            existingItem.quantity += quantity;
            existingItem.price += product.price * quantity;
        } else {

            const totalprice = product.price * quantity;
            user.cart.push({ id, quantity, price: product.price * quantity });
        }

        await user.save();
        res.status(200).json({ success: true, user, message: "Product added to cart successfully" });
    } catch (error) {
        console.error("Error adding product to cart:", error);
        res.status(500).json({ success: false, error: "An error occurred while adding product to cart" });
    }
};







const cartData = async (req, res) => {
    const { email, id, quantity, price } = req.body;
    // console.log(req.body);
    try {
        const user = await User.findOne({ email });
        // console.log("email", email);
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        res.status(200).send({ cart: user.cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "An error occurred while adding item to cart" });
    }
};




const updateCart = async (req, res) => {
    try {
        const { email, id, quantity, price } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        console.log("update", req.body);

        const existingItem = user.cart.find(item => item.id === id);

        if (!existingItem) {
            return res.status(404).json({ msg: "Cart item not found" });
        }
        const totalPrice = existingItem.price / existingItem.quantity * quantity;

        existingItem.quantity = quantity;
        existingItem.price = totalPrice;

        user.markModified('cart')

        await user.save();
        const usercart = user.cart
        res.status(200).json({ message: "Cart item quantity updated successfully", usercart });
    } catch (error) {
        console.error("Error updating cart item quantity:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const uncartItem = async (req, res) => {
    const { email: userEmail, id } = req.body;
    try {
        console.log("Request Body:", req.body);

        const user = await User.findOne({ email: userEmail });
        // console.log("User:", user);

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        const itemIndexToRemove = user.cart.findIndex((item) => item.id === id);
        console.log("Item Index to Remove:", itemIndexToRemove);

        if (itemIndexToRemove === -1) {
            return res.status(404).json({ success: false, error: "Item not found in cart" });
        }
        user.cart.splice(itemIndexToRemove, 1);
        await user.save();
        // console.log("User after removal:", user);
        res.json({ success: true, message: "Product removed from cart successfully" });
    } catch (error) {
        console.error("Error removing product from cart:", error);
        res.status(500).json({ success: false, error: "An error occurred while removing product from cart" });
    }
};




const addQuantity = async (req, res) => {
    try {
        const { email, id } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        const cartItem = user.cart.find(item => item.id === id);

        if (!cartItem) {
            return res.status(404).json({ success: false, error: "Product not found in cart" });
        }
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }
        cartItem.quantity += 1;
        cartItem.price = cartItem.quantity * product.price;

        await user.save();

        res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
        console.error("Error adding quantity to product:", error);
        res.status(500).json({ success: false, error: "An error occurred while adding quantity to product" });
    }
};





const removeQuantity = async (req, res) => {
    try {
        const { email, id } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }
        const cartItem = user.cart.find(item => item.id === id);
        if (!cartItem) {
            return res.status(404).json({ success: false, error: "Product not found in cart" });
        }
        if (cartItem.quantity > 1) {
            cartItem.quantity -= 1;
        } else {
        }
        await user.save()
        res.status(200).json({ success: true, cart: user.cart });
    } catch (error) {
        console.error("Error removing quantity from product:", error);
        res.status(500).json({ success: false, error: "An error occurred while removing quantity from product" });
    }
};

const likeItem = async (req, res) => {
    try {
        const { email, id } = req.body;

        if (!email || !id) {
            console.error("Missing required fields. Email:", email, "ID:", id);
            return res.status(400).json({ success: false, error: "Missing required fields" });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found", success: false });
        }
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        const alreadyLiked = user.likes.find(item => item.id === id);

        if (alreadyLiked) {
            return res.status(400).json({ error: "Product already liked", success: false });
        }
        const newLike = { id };

        user.likes.push(newLike);
        await user.save();
        return res.json({ success: true, message: "Product liked" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "An error occurred" });
    }
};

const unlikeItem = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const { id } = req.body;
            // const likedItemIndex = user.likes.findOne({id:productId});
            const likedItem = user.likes.find(item => item.id === id)

            if (!likedItem) {
                return res.status(400).json({ error: "Product not liked by user", success: false });
            }
            console.log("rem", id, likedItem.id);
            user.likes = user.likes.filter(data => data.id !== id);
            await user.save();
            res.json({ success: true, message: "Product unliked" });
        } else {
            res.status(404).json({ error: "User not found", success: false });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "An error occurred" });
    }
};


const likeData = async (req, res) => {
    const { email, id } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" })
        }

        res.status(200).send({ like: user.likes })
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, error: "An error occured while liking product" })
    }
}
const updatelike = async (req, res) => {
    try {
        const { email, id } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        const index = user.like.findIndex(item => item.id === id);

        if (index === -1) {
            return res.status(404).json({ msg: "Item not found in likes" });
        }
        user.like[index].liked = !user.like[index].liked;
        await user.save();

        res.status(200).json({ success: true, message: "Like status updated successfully", updatedLike: user.like });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "An error occurred while updating like status" });
    }
};


const makePayment = async (req, res) => {
    try {
        const razorpay = new Razorpay({
            key_id: "rzp_test_JorS0iNRvZWc0T",
            key_secret: "hT8woY5skBF0E7nPM6CZp6Wk"
        })
        const options = req.body
        console.log('pay', req.body)
        const order = await razorpay.orders.create(options)
        if (!order) {
            return res.status(404).send("error")
        }
        res.json(order)
    } catch (error) {
        console.log(error)
    }
}

// const Validatepayment = async (req, res) => {
//     try {
//         const { razorpay_order_id, razorpay_payment_id, razorpay_signature
//         } = req.body

//         const sha = crypto.createHmac('sha256', process.env.Razorpay_SECRET_KEY)
//         sha.update(`${razorpay_order_id}|${razorpay_payment_id}`)

//         const digest = sha.digest("hex")

//         if (digest !== razorpay_signature) {
//             return res.status(400).json({ message: "Transaction is legit" })
//         }
//         res.json({
//             message: "success",
//             orderId: razorpay_order_id,
//             paymentId: razorpay_payment_id
//         })
//     } catch (error) {
//     }
// }

const Validatepayment = async (req, res) => {


    try {
        const { paymentId } = req.body;
        const order = await Order.findOne({ 'products.paymentId': paymentId });
    
        if (!order) {
          return res.status(404).json({ error: 'Order not found' });
        }
        order.paymentStatus = 'Paid';
        order.status = 'Completed';
    
        await order.save();
    
        res.json({ message: 'Payment validated successfully' });
      } catch (error) {
        console.error('Error validating payment:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }




const addAddress = async (req, res) => {
    try {
        const { name, address, area, city, phone, email, pin } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(408).json({ mssg: "user not found" });
        }

        const duplicateAddress = user.addresses.find(item =>
            item.name === name && item.address === address && item.area === area &&
            item.city === city && item.phone === phone && item.pin === pin
        );

        if (duplicateAddress) {
            return res.status(409).json({ message: "Address already added" });
        }

        user.addresses.push({ email, name, address, area, city, phone, pin });
        await user.save();

        res.status(200).json({ message: "Address successfully added" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: "Unable to add address", error });
    }
};


const getAddress = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Received request for email:", email);

        const user = await User.findOne({ email });
        console.log("Fetched user:", user);


        if (!user) {
            return res.status(404).send("User not found");
        }

        const currentUser = user.addresses;

        res.status(200).json({ success: true, currentUser });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Internal server error");
    }
};




const updateAddress = async (req, res) => {
    try {
        const { name, address, area, city, phone, email, pin } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const addressIndex = user.addresses.findIndex(addr => addr.email === email);

        if (addressIndex === -1) {
            return res.status(409).json({ message: "Address not found for the user" });
        }

        user.addresses[addressIndex] = { name, address, area, city, phone, email, pin };
        await user.save();

        res.status(200).json({ message: "Address updated successfully", user });
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const { email, addressId } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const addressIndex = user.addresses.findIndex(address => address._id.toString() === addressId);

        if (addressIndex === -1) {
            return res.status(404).json({ message: "Address not found" });
        }
        user.addresses.splice(addressIndex, 1);
        await user.save();
        console.log("Deleted address index:", addressIndex);
        res.status(200).json({ message: "Address successfully deleted" });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ message: "Unable to delete address", error: error.message });
    }
};


const saveOrder = async (req, res) => {
    try {
        const { email, address, pin, phone, payment, products, date, status, paymentStatus } = req.body;
        const order = new Order({
            email,
            deliveryaddress: { address, pin, phone },
            payable: payment,
            products,
            date,
            status,
            paymentStatus
        });
        await order.save();
        res.status(200).json({ success: true, message: "Order saved successfully" });
    } catch (error) {
        console.error("Error saving order:", error);
        res.status(500).json({ success: false, error: "An error occurred while saving the order" });
    }
};
const getOrder = async (req, res) => {
    try {
      const { email } = req.body;
      const orders = await Order.find({ email });
      console.log("Fetched Orders:", orders); 
      res.status(200).json({ success: true, orders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ success: false, error: "An error occurred while fetching the orders" });
    }
  };
  
  const Orderstatus= async(req,res)=>{
  const { orderId, status, paymentStatus } = req.body;
    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        order.status = status || order.status;
        order.paymentStatus = paymentStatus || order.paymentStatus;
        await order.save();
        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error });
    }


}








module.exports = {
    createuser,
    loginuser,
    addToCart,
    cartData,
    updateCart,
    addQuantity,
    removeQuantity,
    uncartItem,
    likeItem,
    unlikeItem,
    likeData,
    updatelike,
    makePayment,
    Validatepayment,
    addAddress,
    getAddress,
    updateAddress,
    deleteAddress,
    saveOrder,
    getOrder,
    Orderstatus

}