const Product = require('../models/productmodel');
const User = require('../models/usermodel');

const getProducts = async (req, res) => {
  try {
    const { id, name, category, image, description, price } = req.body
    const allProducts = await Product.find();
    res.status(200).json({ message: "All Product List", allProducts });
  } catch (error) {
    res
      .status(404)
      .json({ message: "All Product List Not Found: ", error: error.message });
    console.log(error);
  }
};



const addProduct = async (req, res) => {
  try {
    const { id, name, category, image, description, price } = req.body
    const product = await new Product({ id, name, category, image, description, price })
    await product.save()
    res.status(200).send(product)
  } catch (error) {
    console.log(error);
  }
}


const updateProduct = async (req, res) => {
  try {
    const pid = req.params.id;
    const { id, name, category, image, description, price } = req.body;
    console.log("id", pid, id);
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: pid },
      { id, name, category, image, description, price },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product updated", updatedProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating product" });
  }
};





const deleteProduct = async (req, res) => {
  const id = req.params.id;
  console.log(req.params.id);

  try {
    const deleteProduct = await Product.findOneAndDelete({ id: id });
    console.log(deleteProduct);
    if (deleteProduct) {
      res
        .status(200)
        .json({ message: "product Deleted", product: deleteProduct });
      return;
    }
    res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ message: "Sever Error", error: error.message });
  }
};


const Getuser = async (req, res) => {
  try {
    const { email, password } = req.body
    const allUsers = await User.find()
    res.status(200).json({ message: "All users list", allUsers })
  } catch (error) {
    res
      .status(404)
      .josn({ message: "All users list is not found:", error: error.message })
    console.log(error)
  }

}
const DeleteUser = async (req, res) => {
  const userId = req.params.id;
  console.log('User ID to delete:', userId);
  try {
    const user = await User.findOneAndDelete({ _id: userId });
    console.log('Deleted user:', user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error occurred in deleting user' });
  }
}

const BanUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isBanned = true;
    await user.save();

    const bannedUsers = await User.find({ isBanned: true });

    res.status(200).json({ message: 'User banned successfully', user, bannedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error occurred in banning user' });
  }
}

const UnBanUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.isBanned = false;
    await user.save();

    const unbannedUsers = await User.find({ isBanned: false });

    res.status(200).json({ message: "User unbanned successfully", user, unbannedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error occurred in unbanning user' });
  }
}






module.exports = { getProducts, updateProduct, deleteProduct, DeleteUser, BanUser, addProduct, Getuser, UnBanUser };




