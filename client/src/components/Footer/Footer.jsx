import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { FaGithubSquare, FaLinkedin } from "react-icons/fa";
import { Mail } from 'lucide-react';

export default function Footer() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('profile'));
        setIsLoggedIn(!!user);
    }, []);

    return (
        <footer className="w-full bg-[#2b2a2a] text-[#e2e3e2] flex flex-col mt-auto shrink-0 border-t border-[#323232]">
            {/* Top Animated Gradient Bar */}
            <div className="footgrad"></div>

            {/* Main Compact Content */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Left: Navigation Buttons in One Line */}
                <nav className="flex items-center gap-6 text-sm font-semibold">
                    {isLoggedIn ? (
                        <>
                            <button 
                                onClick={() => navigate('/home')} 
                                className="text-[#e2e3e2] hover:text-[#55a940] transition-colors bg-transparent border-none p-0 cursor-pointer"
                            >
                                Home
                            </button>
                            <button 
                                onClick={() => navigate('/join-room')} 
                                className="text-[#e2e3e2] hover:text-[#55a940] transition-colors bg-transparent border-none p-0 cursor-pointer"
                            >
                                Join Room
                            </button>
                            <button 
                                onClick={() => navigate('/about')} 
                                className="text-[#e2e3e2] hover:text-[#55a940] transition-colors bg-transparent border-none p-0 cursor-pointer"
                            >
                                About Us
                            </button>
                        </>
                    ) : (
                        <>
                            <button 
                                onClick={() => navigate('/auth?mode=login')} 
                                className="text-[#e2e3e2] hover:text-[#55a940] transition-colors bg-transparent border-none p-0 cursor-pointer"
                            >
                                Login
                            </button>
                            <button 
                                onClick={() => navigate('/auth?mode=signup')} 
                                className="text-[#e2e3e2] hover:text-[#55a940] transition-colors bg-transparent border-none p-0 cursor-pointer"
                            >
                                SignUp
                            </button>
                            <button 
                                onClick={() => navigate('/about')} 
                                className="text-[#e2e3e2] hover:text-[#55a940] transition-colors bg-transparent border-none p-0 cursor-pointer"
                            >
                                About Us
                            </button>
                        </>
                    )}
                </nav>

                {/* Right: Contact & Social Icons */}
                <div className="flex items-center gap-3">
                    <span className="text-xs text-[#bbccb7] font-medium hidden md:inline">Contact Developer:</span>
                    <div className="flex items-center gap-2">
                        {/* Mail Icon Button */}
                        <a 
                            href="mailto:yashagrahari456@gmail.com"
                            className="p-2 rounded-lg bg-[#323232] text-[#e2e3e2] hover:text-[#55a940] hover:bg-[#383838] border border-[#8ab180]/30 transition-all hover:scale-105"
                            title="Send Email (yashagrahari456@gmail.com)"
                        >
                            <Mail className="h-4 w-4" />
                        </a>

                        {/* GitHub Icon Button */}
                        <a 
                            href="https://github.com/Yashagrahari07" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-[#323232] text-[#e2e3e2] hover:text-[#55a940] hover:bg-[#383838] border border-[#8ab180]/30 transition-all hover:scale-105"
                            title="GitHub Profile"
                        >
                            <FaGithubSquare className="h-4 w-4" />
                        </a>

                        {/* LinkedIn Icon Button */}
                        <a 
                            href="https://www.linkedin.com/in/yashagrahari/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-[#323232] text-[#e2e3e2] hover:text-[#55a940] hover:bg-[#383838] border border-[#8ab180]/30 transition-all hover:scale-105"
                            title="LinkedIn Profile"
                        >
                            <FaLinkedin className="h-4 w-4" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright Strip */}
            <div className="w-full bg-[#1c1c1c] py-2 text-center text-xs text-[#bbccb7] border-t border-[#323232]/80">
                © {new Date().getFullYear()} CodeCanvas. All rights reserved.
            </div>
        </footer>
    );
}


