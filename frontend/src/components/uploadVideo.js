import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './upload_pic_styles.css';
import pic from './images/video.gif';
import Navigation from './Navigation.js';



function VideoPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [detectedPose, setDetectedPose] = useState('Unknown Pose');
    const [processing, setProcessing] = useState(false);
    const [modifiedVideoUrl, setModifiedVideoUrl] = useState(null);
    const [errPose,setErrPose] = useState('')


    useEffect(() => {
      if(localStorage.getItem('access_token') === null){
          window.location.href = '/login-signup'  
      }
    } , []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setDetectedPose('Processing...');
        setProcessing(true);

        const formData = new FormData();
        formData.append('video', event.target.files[0]);

        axios.post('http://localhost:8000/api/pose-estimation-video/', formData, { responseType: 'blob' })
            .then(response => {
                setProcessing(false);
                setDetectedPose('Pose estimation completed!');
                setErrPose(response.data.error_dict);

                
                const modifiedVideoBlob = new Blob([response.data], { type: 'video/mp4' });
                
                // Generate a URL for the Blob
                const url = URL.createObjectURL(modifiedVideoBlob);
                setModifiedVideoUrl(url);
            })
            .catch(error => {
                console.error('Error:', error);
                setProcessing(false);
                setDetectedPose('Error during pose estimation');
                setErrPose('Error during pose estimation');
            });
    };

    return (
        <div>
          <Navigation></Navigation>
          <br></br>
          <br></br>
          <div className="uploadPic-container">
            <h1>Pose Estimation</h1>
            <div className="uploadPic-column align-center p-2xl">
                  <img src={pic} alt="" className='upload_vid' />
            </div>
            <div className="upload-input-container">
                  <label htmlFor="file" className="upload-input-button">Choose File</label>
                  <input type="file" id="file" accept="video/*" onChange={handleFileChange} className="upload-input" />
            </div>
            {/* <input type="file" accept="video/*" onChange={handleFileChange} className="upload-input" /> */}
        
            {processing && <p className="processing-message">Processing video...</p>}
        
            {selectedFile && (
              <div className="uploaded-image-container">
                <h2>Uploaded Video:</h2>
                <video width="400" controls className="uploaded-image">
                  <source src={URL.createObjectURL(selectedFile)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
        
            {modifiedVideoUrl && (
              <div className="uploaded-image-container">
                <h2>Modified Video:</h2>
                <video width="400" controls className="uploaded-image">
                  <source src={modifiedVideoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

              {detectedPose !== 'Unknown Pose' && (
                  <div className="detected-pose">
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
              )}
          </div>
        </div>
        
      );
}

export default VideoPage;