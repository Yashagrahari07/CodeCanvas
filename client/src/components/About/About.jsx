import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './styles.css';
import logo from '../../assets/logoCode.png';

const About = () => {
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="about-container">
                <div className="about-content">
                    <div className="about-header">
                        <img src={logo} alt="CodeCanvas Logo" className="about-logo" />
                        <h1 className="magic">About CodeCanvas</h1>
                    </div>

                    <div className="about-section">
                        <h2>What is CodeCanvas?</h2>
                        <p>
                            CodeCanvas is a powerful, collaborative coding platform designed for developers who want to 
                            code, collaborate, and create together. Whether you're working on personal projects, 
                            learning new languages, or collaborating with a team, CodeCanvas provides the tools you need 
                            to bring your ideas to life.
                        </p>
                    </div>

                    <div className="about-section">
                        <h2>Features</h2>
                        <div className="features-grid">
                            <div className="feature-card">
                                <h3>📁 Workspace Management</h3>
                                <p>Organize your code into folders and workspaces for better project management.</p>
                            </div>
                            <div className="feature-card">
                                <h3>👥 Real-time Collaboration</h3>
                                <p>Join rooms and code together with your team in real-time using our collaborative editor.</p>
                            </div>
                            <div className="feature-card">
                                <h3>💻 Multi-language Support</h3>
                                <p>Code in multiple languages including C++, Python, JavaScript, and Java.</p>
                            </div>
                            <div className="feature-card">
                                <h3>▶️ Code Execution</h3>
                                <p>Run and test your code directly in the browser with instant results.</p>
                            </div>
                            <div className="feature-card">
                                <h3>🎨 Modern Editor</h3>
                                <p>Enjoy a beautiful, syntax-highlighted code editor with dark mode support.</p>
                            </div>
                            <div className="feature-card">
                                <h3>🔒 Secure & Private</h3>
                                <p>Your code is secure with user authentication and private workspaces.</p>
                            </div>
                        </div>
                    </div>

                    <div className="about-section">
                        <h2>How to Get Started</h2>
                        <div className="steps-list">
                            <div className="step-item">
                                <span className="step-number">1</span>
                                <div className="step-content">
                                    <h3>Sign Up</h3>
                                    <p>Create your free account to start coding</p>
                                </div>
                            </div>
                            <div className="step-item">
                                <span className="step-number">2</span>
                                <div className="step-content">
                                    <h3>Create Workspaces</h3>
                                    <p>Organize your projects into folders and workspaces</p>
                                </div>
                            </div>
                            <div className="step-item">
                                <span className="step-number">3</span>
                                <div className="step-content">
                                    <h3>Start Coding</h3>
                                    <p>Write, run, and test your code in our powerful editor</p>
                                </div>
                            </div>
                            <div className="step-item">
                                <span className="step-number">4</span>
                                <div className="step-content">
                                    <h3>Collaborate</h3>
                                    <p>Join rooms and code together with friends or teammates</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="about-section">
                        <h2>Technologies</h2>
                        <p className="tech-description">
                            CodeCanvas is built with modern web technologies including React, Node.js, Express, 
                            MongoDB, Socket.io, and Monaco Editor to provide you with the best coding experience.
                        </p>
                    </div>

                    <div className="about-actions">
                        <button className="action-button" onClick={() => navigate('/')}>
                            Get Started
                        </button>
                        <button className="action-button secondary" onClick={() => navigate('/home')}>
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;

