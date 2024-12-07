import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import WebcamPage from './components/WebcamPage.js';
import VideoPage from './components/uploadVideo.js';
import UploadPicComponent from './components/UploadPic.js';
import LoginPage from './components/LoginPage.js';
import LandingPage from './components/LandingLogin.js';
import OurTeam from './components/aboutUs.js';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login-signup" element={<LoginPage />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/webcam" element={<WebcamPage />} />
                <Route path="/video" element={<VideoPage />} />
                <Route path="/image" element={<UploadPicComponent />} />
                <Route path="/about" element={<OurTeam />} />

            </Routes>
        </Router>
    );
};

export default App;