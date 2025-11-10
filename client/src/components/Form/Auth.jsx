import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import './styles.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import * as api from '../../api/api';
import toast from 'react-hot-toast';
import Footer from '../Footer/Footer';

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode') || 'signup'; // default to signup
    const [isSignUp, setIsSignUp] = useState(mode === 'signup');
    const user=JSON.parse(localStorage.getItem('profile'));
    
    // Update state when URL changes
    useEffect(() => {
        setIsSignUp(mode === 'signup');
    }, [mode]);
    
    // Redirect to home if already logged in
    useEffect(() => {
        if (user) {
            navigate('/home');
        }
    }, [user, navigate]);
    
    const [formData, setFormData] = useState({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
  });

  const handleSwitchMode = () => {
    const newMode = isSignUp ? 'login' : 'signup';
    navigate(`/auth?mode=${newMode}`, { replace: true });
    setFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const signin = async (formData, navigate) => {
    try {
      const { data } = await api.signIn(formData);
      console.log(data);
      localStorage.setItem('profile', JSON.stringify(data));
      navigate('/home');
      toast.success("Signed in successfully",{
        position:'top-center',
        duration:2000
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Some error occured",{
        position:'top-center', 
        duration:2000
      });
    }
  };

  const signup = async (formData, navigate) => {
    console.log(formData)
    try {
      const { data } = await api.signUp(formData);
      console.log(data);
      localStorage.setItem('profile', JSON.stringify(data));
      navigate('/home');
      toast.success("Signed up successfully",{
        position:'top-center',
        duration:2000
      })
    } catch (error) {
      toast.error(error?.response?.data?.message || "Some error occured",{
        position:'top-center', 
        duration:2000
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      signup(formData, navigate);
    } else {
      signin(formData, navigate);
    }
  };


  return (
    <><Navbar/>
    <div className='container' id='login'>
      {!user && <form className='formWrapper' onSubmit={handleSubmit}>
        <h5 className='magic' >
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </h5>
        <div className="inputGroup">
        {isSignUp && (      
            <input
              type="text"
              id="fullName"
              className='inputBox'
              name="fullName"
              placeholder='Full Name'
              value={formData.fullName}
              onChange={handleChange}
            />         
        )}
        <input
          type="email"
          id="email"
          className='inputBox'
          name="email"
          placeholder='Email'
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className='inputBox'
          id="password"
          name="password"
          placeholder='Password'
          value={formData.password}
          onChange={handleChange}
          type={showPassword ? 'text' : 'password'}
          required
        />
        <div onClick={handleShowPassword}>
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </div>
        {isSignUp && (
          <div className="inputGroup">
            <input
              type="password"
              className='inputBox'
              id="confirmPassword"
              name="confirmPassword"
              placeholder='Confirm Password'
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        )}
        <button type="submit" className="button">
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </button>
        <a onClick={handleSwitchMode}>
          {isSignUp ? 'Already have an account? Sign In' : 'Don\'t have an account? Sign Up'}
        </a>
        </div>
      </form>}
    </div>  
    <Footer/>
    </>
  );
};

export default Auth;
