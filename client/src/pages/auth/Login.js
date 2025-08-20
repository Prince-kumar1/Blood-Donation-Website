import React, { useState } from 'react'
import Form from '../../components/shared/Form/Form'
import { useSelector } from 'react-redux'
import { DNA } from 'react-loader-spinner'
import toast from 'react-hot-toast'
import './Login.css'

const Login = () => {
  const { loading, error } = useSelector(state => state.auth)
  
  return (
    <>
      {error && <span>{toast.error(error)}</span>}
      <div className='login-container'>
        <div className='login-background'>
          <div className='red-blood-cells'></div>
          <div className='red-blood-cells'></div>
          <div className='red-blood-cells'></div>
        </div>
        
        <div className='login-content'>
          <div className='login-card'>
            <div className='login-header'>
              <div className='logo-container'>
                <div className='blood-drop-icon'>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#bb0a1e">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <h1 className='app-title'>LifeStream Donor</h1>
                <p className='app-tagline'>Share your life force, save lives</p>
              </div>
            </div>
            
            <div className='login-form-section'>
              {loading ? (
                <div className="loader-container">
                  <DNA
                    visible={true}
                    height="120"
                    width="120"
                    ariaLabel="dna-loading"
                    wrapperStyle={{}}
                    wrapperClass="dna-wrapper"
                    color="#bb0a1e"
                  />
                  <p className='loading-text'>Authenticating...</p>
                </div>
              ) : (
                <Form formTitle={"Log In"} submitBtn={"Login"} formType={'login'} />
              )}
            </div>
            
            <div className='login-footer'>
              <p>Not a donor yet? <a href="/register" className='register-link'>Join our lifesaving community</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login