import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './styles.css';
import logo from '../../assets/logoCode.png';
import { FolderCode, Users, Code2, PlayCircle, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Landing = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));

    const features = [
        {
            icon: <FolderCode className="h-10 w-10 text-[#55a940]" />,
            title: "Workspace Management",
            description: "Organize your code effortlessly into nested folders and interactive workspaces."
        },
        {
            icon: <Users className="h-10 w-10 text-[#55a940]" />,
            title: "Real-time Collaboration",
            description: "Code together with your team simultaneously in shared sync rooms."
        },
        {
            icon: <Code2 className="h-10 w-10 text-[#55a940]" />,
            title: "Multi-Language Support",
            description: "Write, edit, and run code in C++, Python, JavaScript, Java and more."
        },
        {
            icon: <PlayCircle className="h-10 w-10 text-[#55a940]" />,
            title: "Instant Code Execution",
            description: "Run and test your code instantly with custom input and terminal output."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#323232] text-[#e2e3e2] selection:bg-[#55a940] selection:text-white">
            <Navbar />

            {/* Main Content / Hero */}
            <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto flex flex-col items-center mb-16">
                    <div className="relative mb-6">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#55a940] to-[#8ab180] opacity-30 blur-lg animate-pulse" />
                        <img 
                            src={logo} 
                            alt="CodeCanvas Logo" 
                            className="relative h-28 w-28 md:h-36 md:w-36 object-contain landing-logo" 
                        />
                    </div>

                    <h1 className="magic text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-4">
                        CodeCanvas
                    </h1>

                    <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#e2e3e2] mb-6 flex items-center justify-center gap-2">
                        <Sparkles className="h-6 w-6 text-[#55a940]" />
                        Code, Collaborate, Create Together
                    </p>

                    <p className="text-base sm:text-lg text-[#bbccb7] max-w-2xl leading-relaxed mb-10">
                        A modern collaborative developer workspace for writing code, building projects, 
                        and collaborating in real-time rooms with instant code execution.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center items-center">
                        {user ? (
                            <>
                                <Button 
                                    size="lg" 
                                    onClick={() => navigate('/home')}
                                    className="w-full sm:w-auto px-8 py-6 text-lg font-bold bg-[#55a940] hover:bg-[#61ab4e] text-white shadow-lg shadow-emerald-900/30 transition-all duration-300 hover:scale-105"
                                >
                                    Go to Dashboard
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button 
                                    size="lg" 
                                    variant="outline"
                                    onClick={() => navigate('/about')}
                                    className="w-full sm:w-auto px-8 py-6 text-lg font-bold border-2 border-[#e2e3e2] text-[#e2e3e2] hover:bg-[#e2e3e2] hover:text-[#2b2a2a] transition-all duration-300 hover:scale-105"
                                >
                                    Learn More
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button 
                                    size="lg" 
                                    onClick={() => navigate('/auth?mode=signup')}
                                    className="w-full sm:w-auto px-8 py-6 text-lg font-bold bg-[#55a940] hover:bg-[#61ab4e] text-white shadow-lg shadow-emerald-900/30 transition-all duration-300 hover:scale-105"
                                >
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button 
                                    size="lg" 
                                    variant="outline"
                                    onClick={() => navigate('/about')}
                                    className="w-full sm:w-auto px-8 py-6 text-lg font-bold border-2 border-[#e2e3e2] text-[#e2e3e2] hover:bg-[#e2e3e2] hover:text-[#2b2a2a] transition-all duration-300 hover:scale-105"
                                >
                                    Explore Platform
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full mt-8">
                    {features.map((feat, index) => (
                        <Card 
                            key={index} 
                            className="bg-[#2b2a2a]/80 border-2 border-[#8ab180]/30 hover:border-[#55a940] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-black/40 group"
                        >
                            <CardHeader className="text-center pb-2">
                                <div className="mx-auto mb-3 p-3 rounded-xl bg-[#323232] w-fit group-hover:scale-110 transition-transform duration-300 border border-[#8ab180]/20">
                                    {feat.icon}
                                </div>
                                <CardTitle className="text-xl font-bold text-white group-hover:text-[#55a940] transition-colors">
                                    {feat.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <CardDescription className="text-[#bbccb7] text-sm leading-relaxed">
                                    {feat.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Landing;


