import React, { useEffect, useState } from 'react'
import logo from '../../assets/logoCode.png';
import './styles.css';
import { useNavigate, useLocation } from 'react-router-dom';
const Navbar = () => {
    const[login,setLogin]=useState(false);
    const user=JSON.parse(localStorage.getItem('profile'));
    const navigate=useNavigate();
    const location = useLocation();
    
    useEffect(()=>{
        if(user){
            setLogin(true)
        }
    },[])
    
    const handleLogout=()=>{
        localStorage.removeItem('profile');
        navigate('/')
    }
    
    // Check if we're on auth page and what mode
    const isOnAuthPage = location.pathname === '/auth';
    const searchParams = new URLSearchParams(location.search);
    const authMode = searchParams.get('mode') || 'signup';
    const isLoginMode = authMode === 'login';
    
    // Determine which auth button to show
    const getAuthButton = () => {
        if (!isOnAuthPage) {
            // Not on auth page - show "Login" as default
            return (
                <button className="menubuts" onClick={() => navigate('/auth?mode=login')}>
                    <a href="#login">Login</a>
                </button>
            );
        } else {
            // On auth page - show opposite mode
            if (isLoginMode) {
                return (
                    <button className="menubuts" onClick={() => navigate('/auth?mode=signup')}>
                        <a href="#signup">SignUp</a>
                    </button>
                );
            } else {
                return (
                    <button className="menubuts" onClick={() => navigate('/auth?mode=login')}>
                        <a href="#login">Login</a>
                    </button>
                );
            }
        }
    };
    
  return (
    <>
    <div className='navbar'>
        <div className='app-icon' style={{cursor:'pointer'}} onClick={()=>navigate('/')}>
          <img src={logo} alt="logo" />
          <h1 className='magic'>CodeCanvas</h1>
        </div>
        <div className='button-container'>
           {login && <button className="menubuts" onClick={() => navigate('/home')}><a href="#home">Home</a></button>}
           {!login && getAuthButton()}
           {login && <button className="menubuts" onClick={() => navigate('/join-room')}><a href="#join">Join Room</a></button>}
           {login && <button className="menubuts" onClick={handleLogout}><a href="#logout">Logout</a></button>}
           <button className="menubuts" onClick={() => navigate('/about')}><a href="#about">About Us</a></button> 
        </div>   
    </div>
    <div className="navgrad"></div>
    </>
  )
}

export default Navbar
