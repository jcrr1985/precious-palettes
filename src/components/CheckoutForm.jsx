import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { set } from "animejs";
import { useState } from "react";

import axios from "axios";

import Swal from "sweetalert2";
import CongratulationMessage from "./CongratulationsMessage";
import ItemsInCheckout from "./ItemsInCheckout";

const showPaymentErrorAlert = () => {
  Swal.fire("Oops!", "Payment unsuccessful", "warning");
};

const abortController = new AbortController();

//create functional component
const CheckoutForm = ({ cartTotal, setItemCounters, cart, removeFromCart }) => {
  console.log("🚀 ~ file: CheckoutForm.jsx:20 ~ CheckoutForm ~ cart:", cart);
  const [showCongrats, setShowCongrats] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);
  const [showPayment, setShowPayment] = useState(true);
  const [showSucces, setShowSucces] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });
      if (!error) {
        const { id } = paymentMethod;
        const data = await axios.post("http://localhost:3001/api/checkout", {
          id,
          amount: cartTotal * 100,
          signal: abortController.signal,
          timeout: 10000,
        });

        elements.getElement(CardElement).clear();
        setLoading(false);
        handleClose();
        setShowPayment(false);
        setShowSucces(true);
      }
    } catch (error) {
      console.log(error.message);
      setLoading(false);
      showPaymentErrorAlert();
      setOpen(false);
    }
  };

  return (
    <>
      {showPayment ? (
        <div>
          <p className="text-italianno we-are-happy">
            {" "}
            <span>We are Happy with you purchase! </span>{" "}
            <span>Lets do last steps</span>
          </p>
          <div className="form-and-items-wrapper">
            <form
              className="checkout-form--form"
              onSubmit={handleSubmitPayment}
            >
              <div className="checkout-form-left">
                {/* CARD INPUT */}
                <CardElement
                  onChange={(event) => setIsCardComplete(event.complete)}
                />
                {/* address input */}
                <input
                  className="checkout-form--input"
                  type="text"
                  placeholder="Address line 1"
                />
                {/* adresss 2 input  */}
                <input
                  className="checkout-form--input"
                  type="text"
                  placeholder="Address line 2"
                />
                {/* country input  */}
                <div className="doble-input">
                  <input
                    className="checkout-form--input"
                    type="text"
                    placeholder="Country"
                  />
                  {/* ZIP input  */}
                  <input
                    className="checkout-form--input"
                    type="text"
                    placeholder="Code Postal"
                  />
                </div>
                <div className="doble-input">
                  {" "}
                  {/* city input  */}
                  <input
                    className="checkout-form--input"
                    type="text"
                    placeholder="City"
                  />
                  {/* phone nuber input  */}
                  <input
                    className="checkout-form--input"
                    type="text"
                    placeholder="Phone Number"
                  />
                </div>
                {/* email input  */}
                <input
                  className="checkout-form--input"
                  type="text"
                  placeholder="Email"
                />
                {/* <!--BUY BUTTON--> */}
                <span>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <button
                      disabled={!isCardComplete}
                      className={`checkoutform-button ${
                        !isCardComplete ? "disabled" : ""
                      }`}
                    >
                      PLACE
                    </button>
                  )}
                </span>
              </div>
            </form>
            {/* ITEMS DE LA DERECHA EN CHECKOUT */}
            <ItemsInCheckout cart={cart} removeFromCart={removeFromCart} />
          </div>
        </div>
      ) : (
        showSucces && (
          <CongratulationMessage setItemCounters={setItemCounters} />
        )
      )}
    </>
  );
};

export default CheckoutForm;
