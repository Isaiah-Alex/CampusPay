import React from 'react'
import './Card.css'


const Card = ({icon,description}) => {
  return (
    <div className='cards'>
        <div className="card">
          <img src={icon} alt="" />
          <p>{description}</p>
        </div>
    </div>
  )
}

export default Card