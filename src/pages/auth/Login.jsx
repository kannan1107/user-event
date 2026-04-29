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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),transparent_20%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[url('/event.png')] bg-cover bg-center opacity-10"></div>
      <div className="relative z-10 w-full max-w-md px-8 py-10 rounded-[32px] border border-white/10 bg-slate-900/85 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <p className="text-sm text-blue-300 uppercase tracking-[0.3em] mb-2">Event Management</p>
          <h2 className="text-3xl font-semibold">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to manage events, tickets and attendees from a single dashboard.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={data.password}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={remember}
                onChange={handleRemember}
                className="h-4 w-4 rounded border-slate-600 bg-slate-950 text-blue-500 focus:ring-blue-500"
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-blue-300 hover:text-blue-100"
            >
              Forgot password?
            </button>
          </div>

          {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3 text-base font-medium text-white shadow-lg shadow-slate-950/20 transition hover:from-blue-400 hover:to-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
