# Pose Detection App

This application utilizes React for the frontend, Django for the backend, and Python for pose detection. It enables users to upload images and detect human poses within those images.

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (with npm)
- [Python 3.x](https://www.python.org/)
- [Django](https://www.djangoproject.com/)

## Installation

### Frontend (React)

1. Navigate to the `frontend` directory.
2. Run `npm install` to install the required dependencies.
3.  "axios": "^1.6.2",
    "bootstrap": "^5.3.2",
    "feather-icons": "^4.29.1",
    "react": "^18.2.0",
    "react-bootstrap": "^2.9.1",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.1",
    "react-scripts": "5.0.1",
    "react-webcam": "^7.2.0",
    "video-react": "^0.16.0",
    "web-vitals": "^2.1.4"

### Backend (Django)

1. Navigate to the `backend` directory.
2. Create a virtual environment: `python3 -m venv env`
3. Activate the virtual environment:
   - On Windows: `env\Scripts\activate`
   - On macOS and Linux: `source env/bin/activate`
4. Install Python dependencies: `pip3 install -r requirements.txt`

## Running the Application

### Frontend (React)

1. In the `frontend` directory, run `npm start`.
2. The development server should start, and the React app will be accessible at `http://localhost:3000`.

### Backend (Django)

1. In the `backend` directory, make sure your virtual environment is activated.
2. Run Django migrations: `python3 manage.py migrate`
3. Start the Django server: `python3 manage.py runserver`
4. The Django backend will be accessible at `http://localhost:8000`.

## Usage

1. Access the React frontend at `http://localhost:3000`.
2. Upload an image using the provided interface.
3. The uploaded image will be sent to the backend, processed for pose detection using Python, and the detected poses will be displayed.
4. Use Webcam Access for detection of poses


