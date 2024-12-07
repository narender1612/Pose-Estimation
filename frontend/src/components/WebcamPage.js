// import React, { useEffect, useRef, useState } from 'react';
// import Webcam from 'react-webcam';
// import axios from 'axios';
// import Navigation from './Navigation.js';


// const WebcamPage = () => {
//   const webcamRef = useRef();
//   const [capturedImage, setCapturedImage] = useState(null);
//   const [detectedPose, setDetectedPose] = useState('Unknown Pose');
//   const [modifiedImageUrl, setModifiedImageUrl] = useState(null);


//   useEffect(() => {
//     const captureFrame = async () => {
//       if (webcamRef.current) {
//         // const imageSrc = webcamRef.current.getScreenshot();

//         // console.log(imageSrc);

//         // setCapturedImage(imageSrc);
//         // setDetectedPose('Processing...');

//         // const formData = new FormData();
//         // formData.append('image', imageSrc);

//         const imageSrc = webcamRef.current.getScreenshot({ format: 'png' });

//         const blob = await fetch(imageSrc).then((res) => res.blob());

//         setCapturedImage(imageSrc);
//         const formData = new FormData();
//         formData.append('image', blob, 'webcam_capture.png');

//         const config = {
//         headers: {
//             'content-type': 'multipart/form-data',
//         },
//         };

//         axios.post('http://127.0.0.1:8000/api/pose-estimation/', formData,config)
//             .then(response => {
//                 setDetectedPose(response.data.detected_pose);
//                 const modifiedImageBase64 = response.data.modified_image;
//                 const modifiedImageUrl = `data:image/jpeg;base64,${modifiedImageBase64}`;

//                 setModifiedImageUrl(modifiedImageUrl);
//             })
//             .catch(error => {
//                 console.error('Error:', error);
//                 setDetectedPose('Error during pose estimation');
//             });
//         setTimeout(captureFrame, 100);
//       }
//     };

//     captureFrame();
//   }, []);

//   return (
//     <div>
//         <Navigation></Navigation>
//         <br></br>
//         <br></br>
//         <h2>Webcam Feed</h2>
//         <Webcam height={480} width={900} ref={webcamRef} screenshotFormat="image/jpeg" />
//         {/* {capturedImage && <img src={capturedImage} alt="Captured Frame" />} */}
//         {modifiedImageUrl && (
//                     <div>
//                         <h2>Pose Estimation Feed:</h2>
//                         <img src={modifiedImageUrl} alt="Modified" />
//                     </div>
//                 )}
//         <h2>Detected Pose:</h2>
//         <p>{detectedPose}</p>
//     </div>
//   );
// };

// export default WebcamPage;

import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';
import './WebcamPage.css';
import Navigation from './Navigation.js';


const WebcamPage = () => {
  const webcamRef = useRef();
  const [capturedImage, setCapturedImage] = useState(null);
  const [detectedPose, setDetectedPose] = useState('Unknown Pose');
  const [modifiedImageUrl, setModifiedImageUrl] = useState(null);
  const [errPose,setErrPose] = useState('')


  useEffect(() => {
    // if(localStorage.getItem('access_token') === null){
    //   window.location.href = '/login-signup'  
    // }else{
    //   (async () => {
    //     if (webcamRef.current) {
    //       const imageSrc = webcamRef.current.getScreenshot({ format: 'png' });
    //       const blob = await fetch(imageSrc).then((res) => res.blob());
  
    //       setCapturedImage(imageSrc);
  
    //       const formData = new FormData();
    //       formData.append('image', blob, 'webcam_capture.png');
  
    //       const config = {
    //         headers: {
    //           'content-type': 'multipart/form-data',
    //         },
    //       };
  
    //       axios.post('http://127.0.0.1:8000/api/pose-estimation/', formData, config)
    //         .then(response => {
    //           setDetectedPose(response.data.detected_pose);
    //           const modifiedImageBase64 = response.data.modified_image;
    //           const modifiedImageUrl = `data:image/jpeg;base64,${modifiedImageBase64}`;
  
    //           setModifiedImageUrl(modifiedImageUrl);
    //         })
    //         .catch(error => {
    //           console.error('Error:', error);
    //           setDetectedPose('Error during pose estimation');
    //         });
  
    //       setTimeout(captureFrame, 100);
    //     }
    //   })();
    // }
    const captureFrame = async () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot({ format: 'png' });
        const blob = await fetch(imageSrc).then((res) => res.blob());

        setCapturedImage(imageSrc);

        const formData = new FormData();
        formData.append('image', blob, 'webcam_capture.png');

        const config = {
          headers: {
            'content-type': 'multipart/form-data',
          },
        };

        axios.post('http://127.0.0.1:8000/api/pose-estimation/', formData, config)
          .then(response => {
            setDetectedPose(response.data.detected_pose);
            setErrPose(response.data.error_dict);

            const modifiedImageBase64 = response.data.modified_image;
            const modifiedImageUrl = `data:image/jpeg;base64,${modifiedImageBase64}`;

            setModifiedImageUrl(modifiedImageUrl);
          })
          .catch(error => {
            console.error('Error:', error);
            setDetectedPose('Error during pose estimation');
            setErrPose('Error during pose estimation');
          });

        setTimeout(captureFrame, 100);
      }
    };

    captureFrame();
  }, []);

  return (
    <div>
      <Navigation></Navigation>
        <br></br>
        <br></br>
      <div className="webcam-container">
        <h2>Webcam Feed</h2>
        <div className="webcam-stream-container">
          <Webcam className="webcam-stream" height={480} width={900} ref={webcamRef} screenshotFormat="image/jpeg" />
        </div>
        {modifiedImageUrl && (
          <div>
            <h2>Pose Estimation Feed:</h2>
            <div className="pose-estimation-feed-container">
              <img src={modifiedImageUrl} alt="Modified" />
            </div>
          </div>
        )}
        <h2>Detected Pose:</h2>
        <p>{detectedPose}</p>
        <h2>Correction Required</h2>
        <ul>
            {Object.keys(errPose).map(key => (
                <li key={key}>
                    <strong>{key}:</strong> {errPose[key]}
                </li>
            ))}
        </ul>
      </div>
    </div>
    
  );
};

export default WebcamPage;