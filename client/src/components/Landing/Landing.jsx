import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './styles.css';
import logo from '../../assets/logoCode.png';

const Landing = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));

    return (
        <>
            <Navbar />
            <div className="landing-container">
                <div className="landing-content">
                    <div className="landing-hero">
                        <img src={logo} alt="CodeCanvas Logo" className="landing-logo" />
                        <h1 className="magic">CodeCanvas</h1>
                        <p className="landing-tagline">Code, Collaborate, Create Together</p>
                        <p className="landing-description">
                            A powerful platform for developers to write code, collaborate in real-time, 
                            and build amazing projects. Organize your workspaces, join coding rooms, and 
                            bring your ideas to life.
                        </p>
                        <div className="landing-actions">
                            {user ? (
                                <>
                                    <button className="landing-btn primary" onClick={() => navigate('/home')}>
                                        Go to Dashboard
                                    </button>
                                    <button className="landing-btn secondary" onClick={() => navigate('/about')}>
                                        Learn More
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="landing-btn primary" onClick={() => navigate('/auth?mode=signup')}>
                                        Get Started
                                    </button>
                                    <button className="landing-btn secondary" onClick={() => navigate('/about')}>
                                        Learn More
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="landing-features">
                        <div className="feature-item">
                            <div className="feature-icon">📁</div>
                            <h3>Workspace Management</h3>
                            <p>Organize your code into folders and workspaces</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">👥</div>
                            <h3>Real-time Collaboration</h3>
                            <p>Code together with your team in real-time</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">💻</div>
                            <h3>Multi-language Support</h3>
                            <p>Code in C++, Python, JavaScript, and Java</p>
                        </div>
                        <div className="feature-item">
                            <div className="feature-icon">▶️</div>
                            <h3>Code Execution</h3>
                            <p>Run and test your code instantly</p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Landing;

