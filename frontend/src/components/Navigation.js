import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

export default function Navigation() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('access_token') !== null) {
      setIsAuth(true);
    }
  }, [isAuth]);

  return (
    <div>
      <div>
        <header id="nav" className="nav bg-gradient-dark">
          <div className="container">
            <div className="row items-center mb-lg">
              <div className="column align-left">
                <a aria-current="page" className="w-inline-block w--current">
                  <div className="logo">
                    <span id="toplogo" style={{ color: 'rgb(255, 255, 255)' }} className="text-lg">
                      FitFusion
                    </span>
                  </div>
                </a>
              </div>
              <div className="column align-right">
                <div className="row items-center">
                  {isAuth ? (
                    <Link to="/landing" className='button main'>Home</Link>
                  ) : (
                    <Link to="/login-signup" className="button main">Login</Link>
                  )}
                  {isAuth && (
                    <Link to="/about" className="button main">
                      About Us
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

    </div>
  );
}
