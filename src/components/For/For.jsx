import React from 'react'
import './For.css'
import business_logo from '../../assets/business-logo.svg'
import student_logo from '../../assets/student-logo.svg'

const For = () => {
  return (
      <div className="packages">
        <div className='for' >
          <div className="title">
            <img src={student_logo} alt="Business Logo" />
            <h3>For Students</h3>
          </div>
          <div className="items">
          <ul>
            <li>Pay tution</li>
            <li>Buy food</li>
            <li>Shop easity</li>
          </ul>

          </div>
          
        </div>
        
        <div className='for' >
          <div className="title">
            <img src={business_logo} alt="Business Logo" />
            <h3>For Vendors</h3>
          </div>
          <div className="items">
          <ul>
            <li>Recieve payments securly</li> 
            <li>Manage sales</li>
          </ul>

          </div>
          
        </div>
      </div>
  )
}

export default For