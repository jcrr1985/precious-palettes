import React from 'react';


const CartCounter = ({cartItemQuantity}) => {

    return (
        <div style={{top: '-10px', right: '-10px', background: 'red', color: 'white', borderRadius: '50%', fontSize: '0.8rem',  width: '20px', height: '20px', display: 'flex',
        justifyContent: 'center', alignItems: 'center'}}>
            <span>{cartItemQuantity}</span>
        </div>
    )
}
export default CartCounter;