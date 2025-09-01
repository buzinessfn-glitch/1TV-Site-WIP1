
const express = require('express');
const app = express();
const stripe = require('stripe')('YOUR_SECRET_KEY'); // secret stripe key
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const cart = req.body.cart;

  const line_items = cart.map(product => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: product.name,
      },
      unit_amount: parseInt(parseFloat(product.price.replace('$', '')) * 100),
    },
    quantity: 1,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: 'https://your-website.com/success',
    cancel_url: 'https://your-website.com/cancel',
  });

  res.json({ sessionId: session.id });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
//some random site/ bot told me to use this I have not really read what it does and will continue to do so. You're done rex yahoo! :D