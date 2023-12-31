import React from 'react'
import { useNavigate } from 'react-router-dom'
import mainRightImage from './../assets/images/main-right-img.png'

const Main = () => {
  const navigate = useNavigate()

  const scrollToCategories = () => {
    navigate('/')
    const categoriesElement = document.getElementById('categories')
    categoriesElement.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className='main'>
      <div className='main-content'>
        <div className='mrc'>
          <p className='font-light title' style={{ width: 'fit-content' }}>
            We are happy that you are here!{' '}
          </p>
          <button className='button button-browse' onClick={scrollToCategories}>
            Let's start
          </button>
        </div>
      </div>
      <div className='main-right-div'>
        <p className='rotated-text'>
          Here you may find something special for you. Crafts from around the
          world{' '}
        </p>
        <img src={mainRightImage} alt='second logo' />
      </div>
    </div>
  )
}

export default Main
