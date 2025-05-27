import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     console.log(e.target,'-----');
        
    //     setFormData(prev => ({ ...prev, [name]: value }));
    //   };

      const handleSubmit = async (e) => {
        e.preventDefault();
        // Add sign-in logic here (API call, validation etc.)
        // console.log("Form Submitted:", email,password);
        try {
            
            const response = await axios.post('https://chat-app-backend-8lel.onrender.com/api/auth/login', {
              email,
              password
            });
      
            // Handle success response
            if (response.status === 200) {
              toast.success("Successfully Login");
              console.log(response,'res--');
              
              localStorage.setItem("x-access-token",response?.data?.token);
              localStorage.setItem("user-data",JSON.stringify(response?.data?.user));
              navigate("/");
              console.log('User signed up successfully');
              // Redirect or show success message
            }
            else{
              toast.error(response?.message)
            }
          } catch (err) {
            // Handle error response
            toast.error(err?.response?.data?.message)
            console.error('Error signing up:', err.response || err.message);
            // setError(err.response?.data?.message || 'Sign-up failed');
          }
      };

     
    return(
        <>
<div className="flex h-screen justify-center items-center">
<div className="mb-6">
<div className="w-full max-w-xs">
<form className="bg-white rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
<div className="mb-4">
<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
Email ID
</label>
<input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="email" placeholder="Username"
 value={email} onChange={(e) => setEmail(e.target.value)} required />
</div>
<div className="mb-6">
<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
Password
</label>
<input className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"
value={password} onChange={(e) => setPassword(e.target.value)} required />
{/* <p className="text-red-500 text-xs italic">Please choose a password.</p> */}
</div>
<div className="flex items-center justify-between">
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline cursor-pointer" type="submit">
Sign In
</button>
{/* <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
Forgot Password?
</a> */}
</div>
 <p className="text-center text-sm mt-4">
          Don’t have an account?{' '}
    <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
    </Link>
  </p>
</form>
<p className="text-center text-gray-500 text-xs">
&copy;2020 Chat Corp. All rights reserved.
</p>
 </div> 
</div>
</div>
        </>
    )
}

export default Login;