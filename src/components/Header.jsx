import React, { useEffect, useRef, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Link } from 'react-router-dom'
import CloseIcon from '@mui/icons-material/Close'
import BackButton from './BackButton'
import CartCounter from './CartCounter'
import { useLocation } from 'react-router-dom'
import SearchBar from './SearchBar'
import { AccountCircle } from '@mui/icons-material'
import { Tooltip } from '@mui/material'
import TooltipComponent from './Tooltip'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from '@mui/material'
import DialogComponent from './Dialog'
import axios from 'axios'
import { showAutoClosingMessage } from '../App'

const Header = ({ cart, itemCounters }) => {
  const [searchBarInputOpen, setSearchBarInputOpen] = useState(false)
  const location = useLocation()
  const isStripePaymentPage = location.pathname === '/stripe-payment'

  const [isLoginModalOpen, setLoginModalOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const openLoginModal = () => {
    setLoginModalOpen(true)
  }

  const closeLoginModal = () => {
    setLoginModalOpen(false)
  }

  // Calcular el total de ítems en el carrito
  const totalItemsInCart = Object.values(itemCounters).reduce(
    (total, count) => total + count,
    0,
  )

  const inputRef = useRef(null)

  const enableSearchBarInput = () => {
    setSearchBarInputOpen(true)
    inputRef.current?.focus()
  }

  const closeSearchBarInput = () => {
    setSearchBarInputOpen(false)
  }

  const apiUrl = 'http://localhost:3001/api/login'
  const [token, setToken] = useState('')

  const handleLogin = async (username, password) => {
    try {
      console.log('Logging in')
      const response = await axios.post(apiUrl, {
        username,
        password,
      })
      console.log('response', response)

      if (response.status === 200) {
        localStorage.setItem('token', JSON.stringify(response.data.token))
        setToken(response.data.token)
        setIsLogged(true)
        setUsername(response.data.user.username)
        closeLoginModal()
      }
    } catch (error) {
      console.error('Error during login:', error)
      showAutoClosingMessage('invalid credentials', 2000, 'error')
    }
  }

  const [isLogged, setIsLogged] = useState(false)

  let tooltipContent

  const tooltipWelcome = (
    <ul>
      <li>
        <a>Welcome, {username}!</a>
      </li>
      <hr />
      <li>
        <a>Settings</a>
      </li>
      <li>
        <a>My orders</a>
      </li>
      <li>
        <a>My favourites</a>
      </li>
      <li>
        <a onClick={() => setIsLogged(false)}>Log out</a>
      </li>
    </ul>
  )

  const tooltipAuthContent = (
    <ul>
      <li>
        <a onClick={openLoginModal}>Log in</a>{' '}
      </li>
      <br />
      <li>
        <a>Sign up</a>
      </li>
    </ul>
  )

  if (isLogged) {
    tooltipContent = tooltipWelcome
  } else {
    tooltipContent = tooltipAuthContent
  }

  const dialogInputs = [
    {
      label: 'Username!',
      type: 'text',
      onChange: (e) => {
        console.log('e', e)
        setUsername(e)
      },
    },
    {
      label: 'Password',
      type: 'password',
      onChange: (e) => {
        console.log('e', e)
        setPassword(e)
      },
    },
  ]

  return (
    <div>
      <header>
        <BackButton />
        <div className='header-left'></div>

        <div className='header-right'>
          {/* TOOLTIP */}
          <div className='login-Ccomponent'>
            <TooltipComponent tooltipContent={tooltipContent} />
          </div>

          {/* SEARCH ICON */}
          {!isStripePaymentPage && (
            <div className='lupa'>
              {!searchBarInputOpen && (
                <SearchIcon onClick={enableSearchBarInput} />
              )}
            </div>
          )}

          {/* CART_ICON */}
          <Link to='/cart'>
            <ShoppingCartIcon />
            <CartCounter cartItemQuantity={totalItemsInCart} />
          </Link>
        </div>
      </header>

      <div
        className={`search-input-container ${searchBarInputOpen ? 'open' : ''}`}
      >
        {searchBarInputOpen && (
          <div
            className='header-icons header-left-icon'
            onClick={closeSearchBarInput}
          >
            <CloseIcon sx={{ color: '#444' }} />
          </div>
        )}

        <SearchBar />

        <div
          className='header-icons header-right-icon'
          onClick={enableSearchBarInput}
        >
          <SearchIcon sx={{ color: '#444' }} />
        </div>
      </div>

      {/* DIALOG COMPONENT */}

      <DialogComponent
        isLoginModalOpen={isLoginModalOpen}
        closeLoginModal={closeLoginModal}
        handleLogin={handleLogin}
        username={username}
        password={password}
        inputs={dialogInputs}
      />
    </div>
  )
}

export default Header
