import React, { useContext } from "react";
import "./CartItems.css";

import { ShopContext } from "../../Context/ShopContext";

import remove_icon from "../Assets/cart_cross_icon.png";

import { useNavigate } from "react-router-dom";

import { loadStripe } from "@stripe/stripe-js";

import PaymentForm from "../../Pages/PaymentForm";

const CartItems = () => {
  const {
    getTotalCartAmount,
    all_product,
    cartItems,
    removeFromCart,
    increaseQuantity,
  } = useContext(ShopContext);

  console.log(cartItems);
  console.log(all_product);

  const navigate = useNavigate();

  const handleProceedCheckout = () => {
    // Navigate to a new route
    navigate("/payment");
  };

  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51P18XTSEKRm8eQrvsyTIt4JdshwLaFGtsbFp3a64DkIhbafLQEKo51hKVutYRHqWEhuNhBi8rGfhV3YuRfkepBql00RgrH8LIi"
    );
    const body = {
      products: CartItems,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(
      "http://localhost:3000/api/create-checkout-session",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );
    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.log(result.error);
    }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        {/* <p>Remove</p> */}
      </div>
      <hr />

      {all_product.map((e) => {
        if (cartItems[e.id] > 0) {
          return (
            <div key={e.id}>
              <div className="cartitems-format cartitems-format-main">
                <img src={e.image} alt="" className="carticon-product-icon" />
                <p>{e.name}</p>
                <p>${e.new_price}</p>
                <div className="quantity-container">
                  <button
                    className="quantity-btn"
                    onClick={() => removeFromCart(e.id)}
                  >
                    -
                  </button>
                  <p className="quantity">{cartItems[e.id]}</p>
                  <button
                    className="quantity-btn"
                    onClick={() => increaseQuantity(e.id)}
                  >
                    +
                  </button>
                </div>
                <p>${e.new_price * cartItems[e.id]}</p>
              </div>
              <hr />
            </div>
          );
        }
        return null;
      })}

      <div className="cartitems-down">
        <div className="cartitems-total">
          <h1>Cart Total</h1>
          <div>
            <div className="cartitems-total-item">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <p>Shippping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cartitems-total-item">
              <h3>Total</h3>
              <h3>${getTotalCartAmount()}</h3>
            </div>
          </div>
          <button onClick={handleProceedCheckout}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
