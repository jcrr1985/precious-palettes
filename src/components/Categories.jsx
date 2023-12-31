import React from 'react'
import Carousel from './Carousel'
import dress1 from '../assets/images/dress-1.webp'

const Categories = () => {
  return (
    <>
      <div className='categories--description'>
        <div className='categories--title--container'>
          <h1 className='font-light font-title title--categories'>
            Product Categories
          </h1>
        </div>
        <p className='font-light'>
          Our latest collections are full of items you will love!
        </p>
      </div>
      <Carousel />
    </>
  )
}

export default Categories

const images = [dress1, dress1, dress1]
