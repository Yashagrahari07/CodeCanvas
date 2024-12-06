import React, { useState } from 'react';
import './styles.css';
import email from '../../assets/email.svg'
import {
    FaGithubSquare,
    FaInstagramSquare,
    FaLinkedin, 
} from "react-icons/fa";

export default function Footer(){

    return(
        <div className='footer' id='about'>
        <div className='footgrad'></div>       
        <footer>
        <div className='navigation'>
            <div className='links'>
                <a href='#login'><p>Login</p></a>
                <a href='#login'><p>SignUp</p></a>
                <a href='#join'><p>Join Room</p></a>
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
        <div style={{height:'3vh',width:'100%',background:'black',color:'white',textAlign:'center'}}>&#169; 2024 CodeAlong</div>
        </div>
    )
}
