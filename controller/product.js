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
        const products = await Product.find();
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



const addToCart = async(req, res)=>{
    try {
        const { userId, productId, quantity } = req.body;
    
        let cart = await Cart.findOne({ userId });
    
        if (!cart) {
          // Create a new cart if it doesn't exist
          cart = new Cart({ userId, products: [] });
        }
    
        // Check if the product already exists in the cart
        const productIndex = cart.products.findIndex(
          (p) => p.productId.toString() === productId
        );
    
        if (productIndex > -1) {
          // Update the quantity if the product exists
          cart.products[productIndex].quantity += quantity;
        } else {
          // Add the new product to the cart
          cart.products.push({ productId, quantity });
        }
    
        await cart.save();
        res.status(201).json({ message: "Product added to cart", cart });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

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


const updateCart = async(req, res)=>{
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
    
        cart.products[productIndex].quantity = quantity;
        await cart.save();
    
        res.json({ message: "Cart updated", cart });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

const deleteCart = async(req, res)=>{
    try {
        const { cartId, productId } = req.params;
    
        const cart = await Cart.findById(cartId);
    
        if (!cart) {
          return res.status(404).json({ message: "Cart not found" });
        }
    
        cart.products = cart.products.filter(
          (p) => p.productId.toString() !== productId
        );
    
        await cart.save();
        res.json({ message: "Product removed from cart", cart });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}


module.exports = {
    addNewProduct,
    getProduct,
    getSingleProduct,
    deleteProduct,
    updateProduct,
    addToCart,
    getCartData,
    updateCart,
    deleteCart
}