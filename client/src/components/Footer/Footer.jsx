import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import email from '../../assets/email.svg'
import {
    FaGithubSquare,
    FaInstagramSquare,
    FaLinkedin, 
} from "react-icons/fa";

export default function Footer(){
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('profile'));
        setIsLoggedIn(!!user);
    }, []);

    return(
        <div className='footer' id='about'>
        <div className='footgrad'></div>       
        <footer>
        <div className='navigation'>
            <div className='links'>
                {isLoggedIn ? (
                    <>
                        <a onClick={(e) => { e.preventDefault(); navigate('/home'); }} style={{ cursor: 'pointer' }}><p>Home</p></a>
                        <a onClick={(e) => { e.preventDefault(); navigate('/join-room'); }} style={{ cursor: 'pointer' }}><p>Join Room</p></a>
                        <a onClick={(e) => { e.preventDefault(); navigate('/about'); }} style={{ cursor: 'pointer' }}><p>About Us</p></a>
                    </>
                ) : (
                    <>
                        <a onClick={(e) => { e.preventDefault(); navigate('/auth?mode=login'); }} style={{ cursor: 'pointer' }}><p>Login</p></a>
                        <a onClick={(e) => { e.preventDefault(); navigate('/auth?mode=signup'); }} style={{ cursor: 'pointer' }}><p>SignUp</p></a>
                    </>
                )}
            </div>           
        </div>
        <div className='dev-contact'> 
        <h2>Developer's Contact</h2>
            <div style={{display: 'flex', flexDirection:'row',alignItems:'center',fontWeight:'500'}}>
            <img style={{height:'4vh', width:'4vh',margin:'1vh'}}
                 src={email} alt="" />
            <a style={{textDecoration:'none',fontSize:'2vh',color:'white',background:'transparent'}}
                href="mailto:yashagrahari456@gmail.com">yashagrahari456@gmail.com</a>
         </div>
         <div className='butts'>           
            <a className='s-links' target='blank'
            style={{ backgroundColor: 'transparent'}}
            href='https://github.com/Yashagrahari07' ><FaGithubSquare className='glow' /></a>

            <a className='s-links' target='blank' 
            style={{ backgroundColor: 'transparent'}}
            href='https://www.linkedin.com/in/yashagrahari/'><FaLinkedin className='glow'/></a>
           </div>
            </div>
        </footer>
        <div style={{height:'3vh',width:'100%',background:'black',color:'white',textAlign:'center'}}>&#169; 2024 CodeCanvas</div>
        </div>
    )
}
