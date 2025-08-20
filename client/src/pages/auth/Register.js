import React from 'react'
import Form from '../../components/shared/Form/Form'
import { useSelector } from 'react-redux'
import { DNA } from 'react-loader-spinner'
import './Register.css'

const Register = () => {
  const { loading, error } = useSelector(state => state.auth)
  
  return (
    <>
      {error && <span>{alert(error)}</span>}
      <div className="register-container">
        <div className="register-background">
          <div className="red-blood-cells"></div>
          <div className="red-blood-cells"></div>
          <div className="red-blood-cells"></div>
        </div>
        
        <div className="register-content">
          <div className="register-card">
            <div className="register-header">
              <div className="logo-container">
                <div className="blood-drop-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#bb0a1e">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <h1 className="app-title">LifeStream Donor</h1>
                <p className="app-tagline">Become a lifesaver today</p>
              </div>
            </div>
            
            <div className="register-form-section">
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
                  <p className="loading-text">Creating your account...</p>
                </div>
              ) : (
                <Form formTitle={"Register"} submitBtn={"Register"} formType={'register'} />
              )}
            </div>
            
            <div className="register-footer">
              <p>Already a donor? <a href="/login" className="login-link">Sign in here</a></p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register