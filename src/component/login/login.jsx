import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import{loginUser} from "../Redux/loginSlice";
const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
  
  const dispatch = useDispatch();
 const { loading, error } = useSelector((state) => state.login);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(loginUser({ username, password}))
      .then((res) => {
        if(res?.payload?.statusCode===200)
        {
            navigate('/contact');
        }
        else{
            navigate('/')
        }
      })
      .catch((err) => {
        console.error('Login failed:', err);
      });
    }

  return (
    <div className="login-container">
    <form onSubmit={handleSubmit} className="login-form">
    <h3>Login</h3>
      <TextField
        id="username"
        label="Username"
        variant="outlined"
        value={username}
        onChange={handleUsernameChange}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        variant="outlined"
        value={password}
        onChange={handlePasswordChange}
      />
    {error && <div style={{ color: 'red' }}>{error}</div>}
      <Button
        variant="contained"
        color="primary"
        type="submit"
      >
        Login
      </Button>
    </form>
    </div>
  );
};

export default Login;
