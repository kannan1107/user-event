import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/ApplicationApi";
import { createUser } from "../../store/authSlice";

const Login = () => {
 const defaultState = {
  email: "",
  password: "",
 }
 const [data, setData] = useState(defaultState);

  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  
  useEffect(() => {
    if(user) {
      setData({...defaultState})
      navigate("/");
    }
  }, [user, navigate]);
 
  const [Login, { isLoading} ]= useLoginMutation();
  const dispatch = useDispatch();
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const res = await Login(data).unwrap();
      console.log('Login response:', res);
      
      if (res) {
        dispatch(createUser(res));
        setData({ email: "", password: "" });
        setError('');
      } else {
        throw new Error('No response from server');
      }
    } catch (error) {
      console.log('Login error:', error);
      alert('Invalid email or password');
      setError('Invalid email or password');
    }
  };
  
  const handleChange = (event) => {
    setData(state => ({...state, [event.target.name]: event.target.value}));
  };
 
  const handleRemember = () => {
    setRemember(!remember);
  };
  
  const handleForgotPassword = () => {  
    navigate("/forgot-password");
    
  };
  




  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 relative" style={{ backgroundImage: "url('/event.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md relative z-10">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={remember}
                onChange={handleRemember}
                className="mr-2"
              />
              <span className="text-sm">Remember me</span>
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-600 text-sm hover:underline"
            >
              Forgot password?
            </button>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;