import axios from 'axios';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    axios.get('http://localhost:8008/auth/logout')
    .then(res => {
      if(res.data.status) {
        navigate('/signup')
      }
    }).catch(err => {
      console.log(err);
    })
  }

  return (
    <div>
      Home
      <button><Link to="/dashboard">Dashboard</Link></button>
      <br />
      <button><Link to="/editor">Editor</Link></button>
      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Home;