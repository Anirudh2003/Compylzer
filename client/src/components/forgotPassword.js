import React, { useState } from "react";
import './components.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {

    const [email, setEmail] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:8008/auth/forgot-password",{
                email,
            });
            console.log(response.data);
            if(response.data.status){
                alert("Check email for reset password link!!")
                navigate('/login')
            }
        } catch(error){
            console.error(error);
        }
        
    };
    return (
        <div className="sign-up-container"> {/* Fixed class name here */}
            <form className="sign-up-form" onSubmit={handleSubmit}> {/* Added a wrapper for the form */}
                <h2>Forgot Password</h2>
                

                <label htmlFor="email">Email</label>
                <input type="email" autoComplete="off" placeholder="Email" 
                onChange={(e) => setEmail(e.target.value)} required/>

                <button type="submit">Send</button>
            </form>
        </div>
    )
}

export default ForgotPassword;
