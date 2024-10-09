import React,{useState} from 'react';
import './components.css';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post("http://localhost:8008/auth/login",{
                email, 
                password,
            });
            console.log(response.data);
            if(response.data.status){
                navigate('/home')
            }
        } catch(error){
            console.error(error);
        }
        
    };
    return (
        <div className="sign-up-container"> {/* Fixed class name here */}
            <form className="sign-up-form" onSubmit={handleSubmit}> {/* Added a wrapper for the form */}
                <h2>Login</h2>
                
                <label htmlFor="email">Email</label>
                <input type="email" autoComplete="off" placeholder="Email" 
                onChange={(e) => setEmail(e.target.value)} required/>

                <label htmlFor="password">Password</label>
                <input type="password" placeholder="******" 
                onChange={(e) => setPassword(e.target.value)} required/>

                <button type="submit">Login</button>
                <Link to="/forgotPassword">Forgot Password</Link>
                <p>Don't have an Account? <Link to="/signup">Sign Up</Link></p>
            </form>
        </div>
    );
}

export default Login