import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './LoginPage.css';

const LoginPage = () => {
const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const signup = async (e) => {
    e.preventDefault();
    const user = {
      email: email,
      username: username,
      password: password
    };
    try {
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/signup/',
        user,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      localStorage.clear();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;
      navigate('/landing');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const login = async (e) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password
    };
    try {
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/login/',
        user,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      localStorage.clear();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;
      navigate('/landing');
    } catch (error) {
      console.error('Login error:', error);
      // Check if the error object has a 'response' property and 'status' is available
      const errorMessage = error.response?.status
        ? `Login failed with status ${error.response.status}`
        : 'Login failed. Please try again.';
      alert(errorMessage);
    }
  };
  

  return (
    <div className='bodyLogin'>
      <div className="mainLogin">
      <input type="checkbox" id="chk" aria-hidden="true" />
        <div className="Signup">
          <form onSubmit={signup}>
            <label className='label' htmlFor="chk" aria-hidden="true">
              Login
            </label>
            <input className='inputLogin' type="email" name="email" placeholder="Email" required="" onChange={(e) => setEmail(e.target.value)} />
            <input className='inputLogin' type="text" name="username" placeholder="Username" required="" onChange={(e) => setUsername(e.target.value)} />
            <input className="inputLogin" type="password" name="pswd" placeholder="Password" required="" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">Login</button>
          </form>
        </div>

        <div className="login">
          <form onSubmit={login}>
            <label htmlFor="chk" aria-hidden="true">
              SignUp
            </label>
            <input className='inputLogin' type="email" name="email" placeholder="Email" required="" onChange={(e) => setEmail(e.target.value)} />
            <input className='inputLogin' type="password" name="pswd" placeholder="Password" required="" onChange={(e) => setPassword(e.target.value)} />
            <button type="submit">SignUp</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

