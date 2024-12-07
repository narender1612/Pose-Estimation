import React, { useState } from 'react';
import axios from 'axios';
import pic from './images/upload.png';
import './upload_pic_styles.css';
import Navigation from './Navigation.js';


function UploadPicComponent() {
    // const [selectedFile, setSelectedFile] = useState(null);
    const [detectedPose, setDetectedPose] = useState('Unknown Pose');
    const [modifiedImageUrl, setModifiedImageUrl] = useState(null);
    const [errPose,setErrPose] = useState('')

    const handleFileChange = (event) => {
        // setSelectedFile(event.target.files[0]);
        setDetectedPose('Processing...');

        console.log(event.target.files[0])
        const formData = new FormData();
        formData.append('image', event.target.files[0]);

        axios.post('http://127.0.0.1:8000/api/pose-estimation/', formData)
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
    };

    

    return (
        <div>
            <Navigation></Navigation>
            <br></br>
            <br></br>
            <div className="uploadPic-container">
                <h1>Upload a Picture</h1>
                <div className="uploadPic-column align-center p-2xl">
                    <img src={pic} alt="" className='upload_img' />
                </div>
                <div className="upload-input-container">
                    <label htmlFor="file" className="upload-input-button">Choose File</label>
                    <input type="file" id="file" accept="image/*" onChange={handleFileChange} className="upload-input" />
                </div>

                {/* {selectedFile && (
                    <div className="uploaded-image-container">
                        <h2>Uploaded Image:</h2>
                        <img src={URL.createObjectURL(selectedFile)} alt="Uploaded Pose" className="uploaded-image" />
                    </div>
                )} */}

                {modifiedImageUrl && (
                    <div>
                        <h2>Pose Estimation Image:</h2>
                        <img src={modifiedImageUrl} alt="Modified" />
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
export default UploadPicComponent;