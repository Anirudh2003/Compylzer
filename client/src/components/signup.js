import React, { useState } from "react";
import './components.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:8008/auth/signup",{
                username, 
                email, 
                password,
            });
            console.log(response.data);
            if(response.data.status){
                navigate('/login')
            }
        } catch(error){
            console.error(error);
        }
        
    };
    return (
        <div className="sign-up-container"> {/* Fixed class name here */}
            <form className="sign-up-form" onSubmit={handleSubmit}> {/* Added a wrapper for the form */}
                <h2>Signup</h2>
                <input type="text" placeholder="Username" 
                onChange={(e) => setUsername(e.target.value)} required/>

                <label htmlFor="email">Email</label>
                <input type="email" autoComplete="off" placeholder="Email" 
                onChange={(e) => setEmail(e.target.value)} required/>

                <label htmlFor="password">Password</label>
                <input type="password" placeholder="******" 
                onChange={(e) => setPassword(e.target.value)} required/>

                <button type="submit">Sign Up</button>
                <p>Have an Account? <Link to="/login">Login</Link></p>
            </form>
        </div>
    );
};

export default Signup;