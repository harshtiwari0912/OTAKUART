const express = require('express');
const isLoggedin = require('../middlewares/isLoggedin');
const router = express.Router();
const productModel = require('../models/productmodel');
const userModel = require('../models/usermodel');
router.get('/', (req, res) => {
  res.render('index');
});

router.get('/shop',isLoggedin,async (req,res)=>
{
    let products = await productModel.find();
    res.render('shop',{products});
})
router.get('/addtocart/:id', isLoggedin, async (req, res) => {
  let user = await userModel.findOne({ email: req.user.email });

  user.cart.push(req.params.id);
  await user.save();

  req.flash('success', 'Added to cart successfully!!');
  res.redirect('/shop');
});
router.get('/cart', isLoggedin, async (req, res) => {
  try {
    // Get user and populate cart items
    const user = await userModel.findOne({ email: req.user.email }).populate('cart');

    if (!user || !user.cart) {
      return res.render('cart', {
        cartItems: [],
        totalMRP: 0,
        totalDiscount: 0,
        finalAmount: 0
      });
    }

    // Calculate totals
    const cartItems = user.cart.map(product => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      discount: product.discount || 0,
      image: product.image ? `data:image/jpeg;base64,${product.image.toString('base64')}` : null
    }));

    const totalMRP = cartItems.reduce((acc, item) => acc + item.price, 0);
    const totalDiscount = cartItems.reduce((acc, item) => acc + (item.discount || 0), 0);
    const platformFee = 20;
    const shippingFee = 0;

    const finalAmount = totalMRP - totalDiscount + platformFee + shippingFee;

    res.render('cart', {
      cartItems,
      totalMRP,
      totalDiscount,
      platformFee,
      shippingFee,
      finalAmount
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
module.exports = router;