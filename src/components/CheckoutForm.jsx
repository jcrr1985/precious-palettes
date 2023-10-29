import { CircularProgress, Grid, Modal } from "@mui/material";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { set } from "animejs";
import { useState } from "react";

import axios from "axios";

import Swal from "sweetalert2";

const showPaymentSuccessAlert = () => {
  Swal.fire("Payment Successful!", "Thank you for your purchase.", "success");
};

//create functional component
const CheckoutForm = ({ cartTotal, setCongratulationOpen }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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
        });

        elements.getElement(CardElement).clear();
      }
    } catch (error) {
      console.log(error.message);
    }

    setLoading(false);
    handleClose();
    setCongratulationOpen(true);
    showPaymentSuccessAlert();
  };

  const [open, setOpen] = useState(true);
  const handleClose = () => setOpen(false);
  const [showPayment, setShowPayment] = useState(true);

  return (
    <>
      {showPayment ? (
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          <form className="checkout-form--form" onSubmit={handleSubmit}>
            <Grid container spacing={2} justifyContent="center">
              {/* Fila superior */}
              <Grid item xs={12} sm={4}>
                <CardElement />
              </Grid>
            </Grid>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <button
                  className="checkout--form-button--buy"
                  disabled={!stripe}
                  style={{ width: "100%" }}
                >
                  {loading ? <CircularProgress /> : "Buy"}
                </button>
              </Grid>
            </Grid>
          </form>
        </Modal>
      ) : (
        <p>success!</p>
      )}
    </>
  );
};

export default CheckoutForm;