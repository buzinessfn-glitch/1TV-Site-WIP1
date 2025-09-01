// ========================
// CONFIGURATION before you read all this cod elet me inform you that yes, I did use help from the internet and multiple sites etc as I am basiaclly a coding toddler.
// ========================
const STRIPE_CHECKOUT_SESSION_URL = 'https://your-backend.com/create-checkout-session'; //Rex all the apis and stuf i fille din random shit cuz I still need to set those up
const EMAIL_API_URL = 'JOUW_EMAIL_API_URL'; 
const CONTACT_EMAIL = 'Business.1TV@gmail.com'; 


const stripePublicKey = 'PUBLIC_STRIPE_KEY';
const stripe = Stripe(stripePublicKey);

if (!stripe) {
  alert('Stripe is not properly initialized.');
}

// 
// CART FUNCTIONALITY
// 

function getCart() {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addProductToCart(product) {
  const cart = getCart();
  cart.push(product);
  saveCart(cart);
  updateCartDisplay();
}

function updateCartDisplay() {
  const cartProducts = document.querySelector('.cart-products');
  if (!cartProducts) return;

  const cart = getCart();
  cartProducts.innerHTML = '';

  if (cart.length === 0) {
    cartProducts.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  cart.forEach(product => {
    const productHTML = `
      <div class="product">
        <h2>${product.name}</h2>
        <p>${product.price}</p>
      </div>
    `;
    cartProducts.insertAdjacentHTML('beforeend', productHTML);
  });
}

// 
// ADD TO CART BUTTONS
// 

document.querySelectorAll('.add-to-cart').forEach(button => {
  button.addEventListener('click', () => {
    const product = {
      name: button.parentNode.querySelector('h2').textContent,
      price: button.parentNode.querySelector('p:last-of-type').textContent
    };
    addProductToCart(product);
  });
});

// 
// CHECKOUT VIA STRIPE
// 

const checkoutButton = document.querySelector('.checkout');
if (checkoutButton) {
  checkoutButton.addEventListener('click', () => {
    const cart = getCart();
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    checkoutButton.disabled = true;

    fetch(STRIPE_CHECKOUT_SESSION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cart })
    })
      .then(response => response.json())
      .then(data => {
        if (data.sessionId) {
          stripe.redirectToCheckout({ sessionId: data.sessionId });
        } else {
          console.error('Stripe session creation failed:', data);
          alert('Checkout failed.');
          checkoutButton.disabled = false; 
        }
      })
      .catch(error => {
        console.error('Stripe Checkout error:', error);
        alert('Error during checkout.');
        checkoutButton.disabled = false; 
      });
  });
}

// 
// CONTACT FORM
// 

const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = contactForm.querySelector('input[name="email"]').value;

    fetch(EMAIL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: email,
        from: CONTACT_EMAIL,
        subject: "Thanks for reaching out to One True Vision!",
        message: "We'll get back to you as soon as possible!"
      })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Email sent:', data);
        alert('Thanks! We\'ll be in touch soon.');
        contactForm.reset();
      })
      .catch(error => {
        console.error('Email error:', error);
        alert('Error sending email.');
      });
  });
}

//
// CHECKOUT FORM (Optional i think)
// 

const checkoutForm = document.querySelector('#checkout-form');
if (checkoutForm) {
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = checkoutForm.querySelector('input[name="name"]').value;
    const email = checkoutForm.querySelector('input[name="email"]').value;
    const address = checkoutForm.querySelector('input[name="address"]').value;
    const cart = getCart();

    // 
    alert('Proceed to checkout via the main "Checkout" button. This form is optional.');
  });
}

// 
// INIT ON PAGE LOAD
// 

document.addEventListener('DOMContentLoaded', () => {
  updateCartDisplay();
});
