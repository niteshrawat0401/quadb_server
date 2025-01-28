const {Router} = require('express');
const { addNewProduct, getProduct, updateProduct, deleteProduct, getSingleProduct, addToCart,getCartData,updateCart, deleteCart, productStatus } = require('../controller/product');

const productRouter = Router();

productRouter.post('/products', addNewProduct);
productRouter.get('/products', getProduct);
productRouter.get('/products:id', getSingleProduct);
productRouter.put('/products/:id', updateProduct);
productRouter.put('/productsStatus/:id', productStatus);
productRouter.delete('/products/:id', deleteProduct);
productRouter.post('/cart/:userId', addToCart);
productRouter.get('/cart/:userId', getCartData);
productRouter.put('/cart/:cartId', updateCart);
productRouter.delete('/cart/:cartId/:productId', deleteCart);

module.exports = productRouter