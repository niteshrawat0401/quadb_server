const Cart = require("../model/cart");
const Product = require("../model/product");

const addNewProduct = async(req, res)=>{
        try {
          const product = new Product(req.body);
          await product.save();
          res.status(201).json({ message: 'Product created successfully', product });
        } catch (error) {
          res.status(400).json({ message: 'Error creating the product', error });
        }   
}
const getProduct = async(req, res)=>{
    try {
        const products = await Product.find({productStatus: true});
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
      }
}
const getSingleProduct = async(req, res)=>{
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
          return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching the product', error });
      }
}
const deleteProduct = async(req, res)=>{
    try {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
          return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully', deletedProduct });
      } catch (error) {
        res.status(500).json({ message: 'Error deleting the product', error });
      } 
}
const updateProduct = async(req, res)=>{
    try {
        const { id } = req.params;
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!updatedProduct) {
          return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product updated successfully', updatedProduct });
      } catch (error) {
        res.status(400).json({ message: 'Error updating the product', error });
      }
}


const productStatus = async(req, res)=>{
  const {id} = req.params;
  try {
    const productFind = await Product.findById({_id: id});
    if(productFind?.productStatus){
      await Product.updateOne({_id: productFind?._id},{ productStatus: false} ,{new: true})
      let productsStatus = await Product.find({productStatus: false})
      return res.status(200).json({msg: "update status", productsStatus})
    }
    else{
      await Product.updateOne({_id: productFind?._id},{ productStatus: true} ,{new: true})
      let productsStatus = await Product.find({productStatus: true})
      return res.status(200).json({msg: "update status", productsStatus})
    }
    
  } catch (error) {
    return res.status(500).json({msg: "Server error", error: error.msg})
  }
}



const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }

    await cart.save();

    const populatedCart = await Cart.findOne({ userId }).populate({
      path: "products.productId",
      model: "Product",
    });

    res.status(201).json({ message: "Product added to cart", cart: populatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getCartData = async(req, res)=>{
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ userId }).populate("products.productId");
    
        if (!cart) {
          return res.status(404).json({ message: "Cart not found" });
        }
    
        return res.status(200).json(cart);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
}


const updateCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { productId, quantity } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    cart.products[productIndex].quantity = quantity;
    cart.products[productIndex].price = product.price * quantity;

    await cart.save();

    const populatedCart = await Cart.findById(cartId).populate({
      path: "products.productId",
      model: "Product",
    });

    res.json({ message: "Cart updated", cart: populatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteCart = async (req, res) => {
  try {
    const { cartId, productId } = req.params;

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productExists = cart.products.some(
      (p) => p._id.toString() === productId
    );

    if (!productExists) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.products = cart.products.filter(
      (p) => p._id.toString() !== productId
    );

    await cart.save();

    const populatedCart = await Cart.findById(cartId).populate({
      path: "products.productId",
      model: "Product",
    });

    res.json({ message: "Product removed from cart", cart: populatedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
    addNewProduct,
    getProduct,
    getSingleProduct,
    deleteProduct,
    updateProduct,
    productStatus,
    addToCart,
    getCartData,
    updateCart,
    deleteCart
}