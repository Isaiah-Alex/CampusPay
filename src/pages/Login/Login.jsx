import React, { useEffect, useRef, useState } from 'react'
import './Login.css'
import vector from '../../assets/Vector.svg'
import gradient_logo from '../../assets/Logo-Gradient.svg'
import {login, register} from '../../firebase'
import Loader from '../../components/Loader'

const Login = () => {

  const [isCreateAccount, setIsCreateAccount] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isStudent, setIsStudent] = useState(true);

  //loading state
  const [loading, setLoading] = useState(false);
  

  const loginRef = useRef('login');



  const setAccountStateFalse = () => { 
    if (loginRef.current.innerText === 'Login'){
      setIsCreateAccount(false)
    } else{
      setIsCreateAccount(true)
    }
  }; 


  const user_auth = async (e) => {
    e.preventDefault();
    setLoading(true); //for the loader spinner to kick off
    setError(""); //clear previous errors  

    if (!isCreateAccount) {
      await login(email, password);
    }else{
      if (password !== confirmPassword){
        setError("Passwords do not match!");
        setLoading(false); //stop the loader spinner
        return; //stop execution if mismatch in password
      }
      await register(name, email, password);
    }
    setLoading(false); //stop the loader spinner
  }


return (
  <div className="login-bg">
    {/* The loading overlay from lottie */}
    {loading && <Loader />}

    <div className="login">
      <div className="login-logo">
        <img src={gradient_logo} alt="CampusPay Logo" />
        <p>CampusPay</p>
      </div>
      <div className="login-flex-container">
        {isCreateAccount ? (
          <div className="login-title">
            <h1><span>Create</span> Your Account</h1>
            <p>Kindly fill your information</p>
          </div>
        ) : (
          <div className="login-title">
            <h1><span>Hi!</span> Welcome Back</h1>
            <p>You've been missed : ) </p>
          </div>
        )}

        <div className="create-account">
          <h3>{isCreateAccount ? 'Create Account' : 'Login'}</h3>

          <form>
            {isCreateAccount && (
              <>
                <label htmlFor="username">{isStudent ? 'Username' : 'Business Name'}</label>
                <input
                  type="text"
                  placeholder="Isaiah Alex"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </>
            )}

            { !isStudent &&(<><label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="example@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />  </>)}


            {isStudent && (
              <>
                <label htmlFor="password">Mat Number</label>
                <input
                  type="text"
                  placeholder="Enter your Mat Number"
                  required
                  // value={confirmPassword}
                  // onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </>
            )}

              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

            {isCreateAccount && (
              <>
                <label htmlFor="password">Confirm Password</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </>
            )}

            {error && (
              <p style={{ color: "#DD2F27" }} className="error">
                {error}
              </p>
            )}

            {isCreateAccount && (
              <div className="login-agree">
                <input type="checkbox" className="checkbox" required />
                <p>
                  Agree with <span className="login-terms">Terms and condition</span>
                </p>
              </div>
            )}

            <button
              onClick={user_auth}
              type="submit"
              className="register-btn dark"
            >
              {isCreateAccount ? "Register" : "Login"}
            </button>
            <p className="have-account">
              {isCreateAccount ? "Already have an account? " : "Don't have an account? "}
              <span onClick={() => setAccountStateFalse()} ref={loginRef}>
                {isCreateAccount ? "Login" : "Register"}
              </span>
            </p>
            {!isStudent && (
              <p style={{color: 'var(--grey-middle)',
                        paddingTop: '20px'
              }} className='have-account'
             >Are you a student?&nbsp;
             <span onClick={()=> {setIsStudent(true)}}
             style={{borderBottom: '1.5px solid var(--grey-middle)',
               color: 'var(--grey-middle)'}}
             >Click here</span></p>
            )}

            {isStudent && (
              <p style={{color: 'var(--grey-middle)',
                        paddingTop: '20px'
                        
              }} className='have-account'
             >Are you a vendor?&nbsp;
             <span onClick={()=> {setIsStudent(false)}}
             style={{borderBottom: '1.5px solid var(--grey-middle)',
               color: 'var(--grey-middle)'                  
              }}
             >Click here</span></p>
            )}
          </form>
        </div>
      </div>
    </div>
    <img src={vector} alt="" className="left-vector" />
  </div>
);
}

export default Login