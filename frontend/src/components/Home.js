import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import feather from 'feather-icons';
import dumble from './images/dumble.gif';
import f3_img from './images/pullups.gif';
import pushUp from './images/final_push_up.gif';

function Home() {
  const targetRef = useRef(null);

  const handleTryItOutClick = () => {
    targetRef.current.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <div>
      <div id="hide">
        <header id="nav" className="nav bg-gradient-dark">
          <div className="container">
            <div className="row items-center mb-lg">
              <div className="column align-left">
                <a aria-current="page" className="w-inline-block w--current">
                  <div className="logo">
                    <span id="toplogo" style={{ color: 'rgb(235, 235, 235)' }} className="text-lg">
                    FitFusion
                    </span>
                  </div>
                </a>
              </div>
              <div className="column align-right">
                <div className="row items-center">
                  <a className="button main" href="/about">
                    About Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div id="main_banner" className="section overflow-hidden">
          <div className="container mt-3xl mb-3xl">
            <div className="row">
              <div className="column align-center">
                <h1 className="test-giga text-center banner-text">
                  Fit<span style={{ color: 'white' }}>Fusion</span>
                </h1>
                <p className="banner-text-small text-lg text-center max-w-lg">
                  Your Personal Fitness Trainer, at Home!
                </p>
                <a className="button xl main mt-lg" onClick={handleTryItOutClick}>
                  Try it out!
                </a>
              </div>
            </div>
          </div>
        </div>

        <div id="target" className="section">
          <div className="container mt-2xl mb-2xl">
            <div className="row">
              <div className="column align-center">
                <h2 className="max-w-lg text-center">So, what's the problem?</h2>
                <p className="text-lg text-center max-w-md">
                  Learning from workout videos on YouTube can be challenging, as exercising without proper guidance{' '}
                  <b>Can pose safety risks and increase the likelihood of injuries.</b> <br />
                </p>
                <h2 className="max-w-lg text-center">Our Solution!</h2>
                <p className="text-lg text-center max-w-md">
                  Hard → <b>Easy</b> <br />
                  Incorrect pose → <b>Correct pose</b>
                  <br />
                  <b>Smart & Accessible</b>
                </p>
                <p className="text-lg text-center max-w-md">
                  <br />
                  We developed <b>FitFusion!</b>, utilizing pose estimation to provide exercise pose tracking and
                  correction, aiming to make fitness training accessible to everyone.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="container">
            <div className="row items-center v-t">
              <div className="column align-left p-2xl">
                <h2 className="max-w-lg">Fitness training from the comfort of your home</h2>
                <p className="text-lg">
                  Achieve your fitness goals from the convenience of your own home, saving both time and money. It's a
                  win-win!
                </p>
              </div>
              <div className="column align-center p-2xl">
                <img src={dumble} alt="" className="feature-card" />
              </div>
            </div>
            <div className="row reverse items-center v-t">
              <div className="column align-left p-2xl">
                <h2 className="max-w-lg">Why to use FitFusion?</h2>
                <div className="row mt-lg">
                  <p className="text-lg">Use FitFusion to perfect your form, achieve your fitness goals, and stay in shape.</p>
                </div>
                <div className="row mt-lg">
                  <p className="text-lg">Easy, Safe & Smart</p>
                </div>
                <div className="row mt-lg">
                  <p className="text-lg">Privacy preserving. No video data stored.</p>
                </div>
              </div>
              <div className="column align-center p-2xl">
                <img src={f3_img} alt="" className="feature-card" />
              </div>
            </div>
            <div className="row items-center v-t">
              <div className="column align-left p-2xl">
                <h2 className="max-w-lg">Stay Motivated</h2>
                <p className="text-lg">Keep your motivation high with engaging, interactive workouts with <b>FitFusion</b>.</p>
              </div>
              <div className="column align-center p-2xl">
                <img src={pushUp} alt="" className="feature-card" />
              </div>
            </div>
          </div>
        </div>

        <div className="section main mt-2xl">
          <div className="container mt-2xl mb-2xl">
            <div className="row items-center">
              <div className="column align-center">
                <h1 className="max-w-lg text-giga text-center text-white">
                  Login/SignUp
                </h1>
                {/* <Link to="/webcam" className="button xl main white mt-lg">
                  Web Cam
                </Link> */}
                <Link to="/login-signup" className="button xl main white mt-lg">
                  Login/SignUp
                </Link>
                {/* <Link to="/image" className="button xl main white mt-lg">
                  Image
                </Link>
                <Link to="/video" className="button xl main white mt-lg">
                  Video
                </Link> */}
              </div>
            </div>
          </div>
        </div>
        <div id="target" ref={targetRef} className="section">
          {/* random div to scroll down to when GO button is clicked */}
        </div>
        <script
          src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.4.1.min.220afd743d.js?site=5ea1b995c6b4c10f74406a08"
          type="text/javascript"
          integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo="
          crossOrigin="anonymous"
        ></script>

      </div>
    </div>
  );
}

export default Home;