import { CardContent, CircularProgress, Typography } from '@mui/material'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useForm, Controller } from 'react-hook-form'

import { useEffect, useState } from 'react'

import axios from 'axios'

import Swal from 'sweetalert2'
import CongratulationMessage from './CongratulationsMessage'
import ItemsInCheckout from './ItemsInCheckout'
import handleShippoSuccessfulPayment from '../utils/shippo'
import { useNavigate } from 'react-router-dom'

const showPaymentErrorAlert = () => {
  Swal.fire('Oops!', 'Payment unsuccessful', 'warning')
}

const abortController = new AbortController()

//create functional component
const CheckoutForm = ({
  cartTotal,
  setItemCounters,
  cart,
  removeFromCart,
  setCart,
}) => {
  console.log('🚀 ~ file: CheckoutForm.jsx:20 ~ CheckoutForm ~ cart:', cart)
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(true)
  const [showSucces, setShowSucces] = useState(false)
  const [displayCongrats, setDisplayCongrats] = useState(false)
  const [isCardComplete, setIsCardComplete] = useState(false)

  useEffect(() => {
    console.log('showSucces', showSucces)
    if (showSucces) {
      setDisplayCongrats(true)
      console.log('displayCongrats', displayCongrats)
    }
  }, [showSucces])

  const { handleSubmit, control } = useForm()

  const navigate = useNavigate()

  // API KEY STRIPE DEVELOPMENT
  const apiKeyStripe =
    'pk_test_51NmKBUIyGuUAStfNoHpVSC7wjVBwuo8dMuGBe4c4H6z52EdTfdD2XBypC6B3naKeL01K0hVJ3bs45zADZNHSBaZM00UWQtptaZ'

  // API KEY STRIPE PRODUCTION
  // const apiKeyStripe =
  //   'pk_live_51NmKBUIyGuUAStfN4rAplznF6ujE3m1HNSvJIly1f7QQ5NcHeyja8ZWZDVk5Om5nkgF5khWOtNv8Cmv6tBA6Rrcs00rADPAwuU'

  //_______________________________________________________________________________________

  // API URL PRODUCTION
  // const apiUrl = 'https://serverpp2.onrender.com/api/checkout'

  // API URL DEVELOPMENT
  const apiUrl = 'http://localhost:3001/api/checkout'

  const handleSubmitPayment = async (dataForm) => {
    setLoading(true)
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      })
      if (!error) {
        console.log('sin error')
        const { id } = paymentMethod
        const data = await axios.post(
          apiUrl,
          {
            id,
            amount: parseInt(cartTotal) * 100,
            signal: abortController.signal,
            timeout: 10000,
            dataForm,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKeyStripe}`,
            },
          },
        )

        elements.getElement(CardElement).clear()
        setLoading(false)
        setShowPayment(false)
        setShowSucces(true)

        handleShippoSuccessfulPayment()
        setItemCounters({})
      }
    } catch (error) {
      console.log(error.message)
      setLoading(false)
      showPaymentErrorAlert()
    }
  }

  if (cart.length === 0) {
    // navigate programmatically to 'cart-empty' route

    navigate('/cart-empty')
    return
  }

  return (
    <>
      {showPayment ? (
        <div>
          <p className='text-italianno we-are-happy'>
            {' '}
            <span>
              We are Happy with you purchase! <br /> Let's do last steps!
            </span>
          </p>
          <div className='form-and-items-wrapper'>
            {/* FORMULARIO DE LA IZQUIERDA EN CHECKOUT */}
            <form
              className='checkout-form--form'
              onSubmit={handleSubmit(handleSubmitPayment)}
            >
              <div className='checkout-form-left'>
                {/* CARD INPUT */}
                <CardElement
                  onChange={(event) => setIsCardComplete(event.complete)}
                />

                <Controller
                  name='address1'
                  control={control}
                  defaultValue=''
                  render={({ field }) => (
                    <input
                      className='checkout-form--input'
                      type='text'
                      placeholder='Address line 1'
                      {...field}
                    />
                  )}
                />
                <div className='forcards'>
                  {/* address input */}
                  <Controller
                    name='address2'
                    control={control}
                    defaultValue=''
                    render={({ field }) => (
                      <input
                        className='checkout-form--input'
                        type='text'
                        placeholder='Address line 2'
                        {...field}
                      />
                    )}
                  />

                  {/* ZIP input */}
                  <Controller
                    name='zipCode'
                    control={control}
                    defaultValue=''
                    render={({ field }) => (
                      <input
                        className='checkout-form--input'
                        type='text'
                        placeholder='Code Postal'
                        {...field}
                      />
                    )}
                  />
                </div>

                {/* country input */}
                <div className='doble-input'>
                  <Controller
                    name='country'
                    control={control}
                    defaultValue=''
                    render={({ field }) => (
                      <input
                        className='checkout-form--input'
                        type='text'
                        placeholder='Country'
                        {...field}
                      />
                    )}
                  />
                </div>
                <div className='doble-input'>
                  {/* city input */}
                  <Controller
                    name='city'
                    control={control}
                    defaultValue=''
                    render={({ field }) => (
                      <input
                        className='checkout-form--input'
                        type='text'
                        placeholder='City'
                        {...field}
                      />
                    )}
                  />
                  {/* phone number input */}
                  <Controller
                    name='phoneNumber'
                    control={control}
                    defaultValue=''
                    render={({ field }) => (
                      <input
                        className='checkout-form--input'
                        type='text'
                        placeholder='Phone Number'
                        {...field}
                      />
                    )}
                  />
                </div>
                {/* email input */}
                <Controller
                  name='email'
                  control={control}
                  defaultValue=''
                  render={({ field }) => (
                    <input
                      className='checkout-form--input'
                      type='text'
                      placeholder='Email'
                      {...field}
                    />
                  )}
                />
                {/* <!--BUY BUTTON--> */}
                <span>
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    <button
                      disabled={!isCardComplete}
                      className={`checkoutform-button ${
                        !isCardComplete ? 'disabled' : ''
                      }`}
                      type='submit'
                    >
                      PLACE
                    </button>
                  )}
                </span>
              </div>
            </form>
            {/* ITEMS DE LA DERECHA EN CHECKOUT */}
            <div
              className='category-page--div--right'
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <ItemsInCheckout cart={cart} removeFromCart={removeFromCart} />
              {/* TOTAL, COMISIONES */}
              <div className='total-comisiones'>
                <CardContent>
                  <div className='total'>
                    <Typography className='total-text'>Total</Typography>
                    <Typography className='total-price'>
                      ${cartTotal}
                    </Typography>
                  </div>
                  <hr />
                  <div className='comisiones'>
                    <Typography className='envios-text'>
                      Shipping Costs
                    </Typography>
                    <Typography className='envios-price'>$0</Typography>
                  </div>
                </CardContent>
              </div>
            </div>
          </div>
        </div>
      ) : (
        (showSucces || displayCongrats) && (
          <CongratulationMessage setItemCounters={setItemCounters} />
        )
      )}
    </>
  )
}

export default CheckoutForm
