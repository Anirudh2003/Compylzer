import React, { useState } from "react";
import './components.css';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {

    const [password, setPassword] = useState('');
    const {token} = useParams();

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:8008/auth/reset-password/"+token,{
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
                <h2>Reset Password</h2>
                
                <label htmlFor="password">Password</label>
                <input type="password" placeholder="******" 
                onChange={(e) => setPassword(e.target.value)} required/>

                <button type="submit">Reset</button>
            </form>
        </div>
    )
}

export default ResetPassword;
