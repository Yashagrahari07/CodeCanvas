import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './styles.css';
import logo from '../../assets/logoCode.png';
import { 
    FolderCode, 
    Users, 
    Code2, 
    PlayCircle, 
    Layers, 
    ShieldCheck, 
    Sparkles, 
    ArrowRight, 
    Rocket, 
    Cpu,
    CheckCircle2
} from 'lucide-react';
import { 
    SiReact, 
    SiTailwindcss, 
    SiShadcnui, 
    SiNodedotjs, 
    SiExpress, 
    SiMongodb, 
    SiSocketdotio, 
    SiPython, 
    SiCplusplus, 
    SiJavascript 
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { VscCode } from 'react-icons/vsc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <FolderCode className="h-7 w-7 text-[#55a940]" />,
            title: "Workspace Management",
            desc: "Organize your code into folders and workspaces for structured project development."
        },
        {
            icon: <Users className="h-7 w-7 text-[#55a940]" />,
            title: "Real-time Collaboration",
            desc: "Join live rooms and code together simultaneously with instant cursor sync."
        },
        {
            icon: <Code2 className="h-7 w-7 text-[#55a940]" />,
            title: "Multi-language Support",
            desc: "Write, test, and debug in C++, Python 3, JavaScript, and Java."
        },
        {
            icon: <PlayCircle className="h-7 w-7 text-[#55a940]" />,
            title: "Instant Code Execution",
            desc: "Execute code right in your browser with real-time stdout and input streams."
        },
        {
            icon: <Layers className="h-7 w-7 text-[#55a940]" />,
            title: "Monaco Engine",
            desc: "Enjoy VS Code-powered Intellisense, syntax highlighting, and auto-closing tags."
        },
        {
            icon: <ShieldCheck className="h-7 w-7 text-[#55a940]" />,
            title: "Secure & Cloud Synced",
            desc: "Your folders and code files are safely synced across sessions with user auth."
        }
    ];

    const steps = [
        { num: "1", title: "Create Account", desc: "Sign up in seconds to save your code files and folders." },
        { num: "2", title: "Organize Folders", desc: "Create structured workspace folders for your projects." },
        { num: "3", title: "Write & Execute", desc: "Use Monaco Editor to write, run, and test code live." },
        { num: "4", title: "Collaborate Live", desc: "Create or join room IDs for live pair programming." }
    ];

    const supportedLanguages = [
        { name: "C++", icon: <SiCplusplus className="h-8 w-8 text-[#00599C]" />, type: "GCC Compiler" },
        { name: "Python 3", icon: <SiPython className="h-8 w-8 text-[#3776AB]" />, type: "Python Interpreter" },
        { name: "JavaScript", icon: <SiJavascript className="h-8 w-8 text-[#F7DF1E]" />, type: "Node.js Engine" },
        { name: "Java", icon: <FaJava className="h-8 w-8 text-[#ED8B00]" />, type: "OpenJDK Runtime" }
    ];


    return (
        <div className="min-h-screen flex flex-col bg-[#323232] text-[#e2e3e2]">
            <Navbar />

            <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-12 md:py-16">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
                    <img src={logo} alt="CodeCanvas Logo" className="h-20 w-20 md:h-24 md:w-24 object-contain mb-4 animate-bounce" />
                    <h1 className="magic text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                        About CodeCanvas
                    </h1>
                    <p className="text-lg text-[#bbccb7] leading-relaxed">
                        CodeCanvas is a modern collaborative developer platform designed to make coding, 
                        workspace organization, and live pair programming seamless and productive.
                    </p>
                </div>

                {/* Mission Section */}
                <Card className="bg-[#2b2a2a] border-2 border-[#8ab180]/30 shadow-xl mb-12 text-[#e2e3e2]">
                    <CardHeader className="border-b border-[#323232]">
                        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                            <Sparkles className="h-6 w-6 text-[#55a940]" />
                            What is CodeCanvas?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 text-base text-[#bbccb7] leading-relaxed space-y-4">
                        <p>
                            CodeCanvas combines the speed of local code editing with the power of cloud workspaces 
                            and real-time socket-driven rooms. Whether you're practicing algorithms, building project prototypes, 
                            or pair programming with teammates, CodeCanvas brings everything together under one intuitive interface.
                        </p>
                    </CardContent>
                </Card>

                {/* Features Grid */}
                <div className="mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        <Rocket className="h-7 w-7 text-[#55a940]" />
                        Key Features
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feat, idx) => (
                            <Card key={idx} className="bg-[#2b2a2a] border border-[#8ab180]/30 hover:border-[#55a940] transition-all duration-300 hover:-translate-y-1 text-[#e2e3e2]">
                                <CardHeader className="pb-2 flex flex-row items-center gap-3">
                                    <div className="p-2.5 rounded-lg bg-[#323232] border border-[#8ab180]/20">
                                        {feat.icon}
                                    </div>
                                    <CardTitle className="text-lg font-bold text-white">
                                        {feat.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-[#bbccb7] leading-relaxed">
                                        {feat.desc}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Getting Started Steps */}
                <div className="mb-16">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        <CheckCircle2 className="h-7 w-7 text-[#55a940]" />
                        How to Get Started
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((st, idx) => (
                            <div key={idx} className="bg-[#2b2a2a] border border-[#8ab180]/30 rounded-xl p-6 relative flex flex-col justify-between">
                                <div>
                                    <div className="h-10 w-10 rounded-full bg-[#55a940] text-white font-extrabold flex items-center justify-center text-lg mb-4 shadow-md">
                                        {st.num}
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{st.title}</h3>
                                    <p className="text-sm text-[#bbccb7] leading-relaxed">{st.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Languages Supported Section */}
                <Card className="bg-[#2b2a2a] border-2 border-[#8ab180]/30 shadow-xl mb-12 text-[#e2e3e2]">
                    <CardHeader className="border-b border-[#323232]">
                        <CardTitle className="text-2xl font-bold text-white flex items-center gap-3">
                            <Code2 className="h-6 w-6 text-[#55a940]" />
                            Languages Supported
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {supportedLanguages.map((lang, idx) => (
                                <div 
                                    key={idx}
                                    className="group flex flex-col items-center justify-center p-4 rounded-xl bg-[#323232] border border-[#8ab180]/20 hover:border-[#55a940] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30 text-center"
                                >
                                    <div className="mb-2 p-2 rounded-lg bg-[#2b2a2a] group-hover:scale-110 transition-transform">
                                        {lang.icon}
                                    </div>
                                    <h4 className="font-bold text-white text-base group-hover:text-[#55a940] transition-colors">
                                        {lang.name}
                                    </h4>
                                    <span className="text-xs text-[#bbccb7] mt-0.5">
                                        {lang.type}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Call to Action */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                    <Button
                        size="lg"
                        onClick={() => navigate('/')}
                        className="w-full sm:w-auto px-8 py-6 text-lg font-bold bg-[#55a940] hover:bg-[#61ab4e] text-white shadow-lg shadow-emerald-950/40"
                    >
                        Get Started Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => navigate('/home')}
                        className="w-full sm:w-auto px-8 py-6 text-lg font-bold border-2 border-[#e2e3e2] text-[#e2e3e2] hover:bg-[#e2e3e2] hover:text-[#2b2a2a]"
                    >
                        Go to Dashboard
                    </Button>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default About;
