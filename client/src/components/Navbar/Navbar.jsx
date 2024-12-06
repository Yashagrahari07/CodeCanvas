import React, { useEffect, useState } from 'react'
import logo from '../../assets/logoCode.png';
import './styles.css';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
    const[login,setLogin]=useState(false);
    const user=JSON.parse(localStorage.getItem('profile'));
    const navigate=useNavigate();
    useEffect(()=>{
        if(user){
            setLogin(true)
        }
    },[])
    const handleLogout=()=>{
        localStorage.removeItem('profile');
        navigate('/')
    }
  return (
    <>
    <div className='navbar'>
        <div className='app-icon' style={{cursor:'pointer'}} onClick={()=>navigate('/')}>
          <img src={logo} alt="logo" />
          <h1 className='magic'>CodeCanvas</h1>
        </div>
        <div className='button-container'>
           <button className="menubuts" onClick={handleLogout}><a href="#login">{!login?'Login/SignUp':'Logout'}</a></button>
           <button className="menubuts" onClick={() => {if(login) window.open('/', '_blank')}}><a  href='#join'>Join Room</a></button>   
           <button  className="menubuts"><a href='#about'>About Us</a></button> 
        </div>   
    </div>
    <div className="navgrad"></div>
    </>
  )
}

export default Navbar
