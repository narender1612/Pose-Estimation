import {useEffect} from "react";
// import {useState} from "react";
// import axios from "axios";
// import {Navigate} from "react-router-dom";
import { Link } from 'react-router-dom';
import './styles.css';
import Navigation from './Navigation.js';



const LandingPage = () => {
    // const [message, setMessage] = useState('');

    useEffect(() => {
        if(localStorage.getItem('access_token') === null){
            window.location.href = '/login-signup'  
        }
        // else{
        //     (async () => {
        //     try {
        //         const {data} = await axios.get('http://localhost:8000/home/', {
        //         headers: {
        //           'Content-Type': 'application/json',
        //         }
        //       });

        //       setMessage(data.message);
        //     } catch (e) {
        //         console.log('not auth')
        //     }
        // })()};
    }, []);



    return (
        <div >
            <Navigation></Navigation>
            <br></br>
            <br></br>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div></div>
                <div className="container mt-2xl mb-2xl">
                    <div className="row items-center">
                    <div className="column align-center">
                        <h1 className="max-w-lg text-giga text-center text-white">
                        Make fitness part of your daily routine! Go give FitFusion a try
                        </h1>
                        <Link to="/webcam" className="button xl main white mt-lg">
                        Web Cam
                        </Link>
                        <Link to="/image" className="button xl main white mt-lg">
                        Image
                        </Link>
                        <Link to="/video" className="button xl main white mt-lg">
                        Video
                        </Link>
                    </div>
                    </div>
                </div>
            </div>
            
        </div>
        
    )
}

export default LandingPage;