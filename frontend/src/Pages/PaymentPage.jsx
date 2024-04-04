import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

const stripePromise = loadStripe(
  "pk_test_51P18XTSEKRm8eQrvsyTIt4JdshwLaFGtsbFp3a64DkIhbafLQEKo51hKVutYRHqWEhuNhBi8rGfhV3YuRfkepBql00RgrH8LIi"
);

const PaymentPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default PaymentPage;
