import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import './styles.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User as UserIcon, CheckCircle2, KeyRound } from 'lucide-react';
import * as api from '../../api/api';
import toast from 'react-hot-toast';
import Footer from '../Footer/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Auth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode') || 'signup';
    const [isSignUp, setIsSignUp] = useState(mode === 'signup');
    const [loading, setLoading] = useState(false);
    const user = JSON.parse(localStorage.getItem('profile'));
    
    useEffect(() => {
        setIsSignUp(mode === 'signup');
    }, [mode]);
    
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

    const [showPassword, setShowPassword] = useState(false);

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const signin = async (formData, navigate) => {
        setLoading(true);
        try {
            const { data } = await api.signIn(formData);
            localStorage.setItem('profile', JSON.stringify(data));
            toast.success("Signed in successfully", {
                position: 'top-center',
                duration: 2000
            });
            navigate('/home');
        } catch (error) {
            toast.error(error?.response?.data?.message || "Invalid credentials or server error", {
                position: 'top-center', 
                duration: 2000
            });
        } finally {
            setLoading(false);
        }
    };

    const signup = async (formData, navigate) => {
        setLoading(true);
        try {
            const { data } = await api.signUp(formData);
            localStorage.setItem('profile', JSON.stringify(data));
            toast.success("Signed up successfully", {
                position: 'top-center',
                duration: 2000
            });
            navigate('/home');
        } catch (error) {
            toast.error(error?.response?.data?.message || "Sign up failed", {
                position: 'top-center', 
                duration: 2000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSignUp) {
            if (!formData.fullName.trim()) {
                toast.error('Please enter your full name', { position: 'top-center' });
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                toast.error('Passwords do not match', { position: 'top-center' });
                return;
            }
            signup(formData, navigate);
        } else {
            signin(formData, navigate);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#323232] text-[#e2e3e2]">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-4 py-12">
                {!user && (
                    <Card className="w-full max-w-md bg-[#2b2a2a] border-2 border-[#8ab180]/30 shadow-2xl shadow-black/50 text-[#e2e3e2]">
                        <CardHeader className="space-y-1 text-center pb-6 border-b border-[#323232]">
                            <CardTitle className="magic text-3xl font-extrabold tracking-wide">
                                {isSignUp ? 'Create Account' : 'Welcome Back'}
                            </CardTitle>
                            <CardDescription className="text-[#bbccb7] text-sm">
                                {isSignUp 
                                    ? 'Enter your details below to get started with CodeCanvas' 
                                    : 'Sign in to access your workspaces and active rooms'}
                            </CardDescription>
                        </CardHeader>

                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-4 pt-6">
                                {isSignUp && (
                                    <div className="space-y-2">
                                        <Label htmlFor="fullName" className="text-sm font-medium text-[#e2e3e2]">
                                            Full Name
                                        </Label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-[#8ab180]" />
                                            <Input
                                                id="fullName"
                                                name="fullName"
                                                type="text"
                                                placeholder="John Doe"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                required
                                                className="pl-9 bg-[#323232] border-[#8ab180]/30 text-white placeholder:text-gray-400 focus:border-[#55a940] focus:ring-1 focus:ring-[#55a940]"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-[#e2e3e2]">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-[#8ab180]" />
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="developer@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="pl-9 bg-[#323232] border-[#8ab180]/30 text-white placeholder:text-gray-400 focus:border-[#55a940] focus:ring-1 focus:ring-[#55a940]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-[#e2e3e2]">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-[#8ab180]" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            minLength={8}
                                            className="pl-9 pr-10 bg-[#323232] border-[#8ab180]/30 text-white placeholder:text-gray-400 focus:border-[#55a940] focus:ring-1 focus:ring-[#55a940]"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {isSignUp && (
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-sm font-medium text-[#e2e3e2]">
                                            Confirm Password
                                        </Label>
                                        <div className="relative">
                                            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-[#8ab180]" />
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                                minLength={8}
                                                className="pl-9 bg-[#323232] border-[#8ab180]/30 text-white placeholder:text-gray-400 focus:border-[#55a940] focus:ring-1 focus:ring-[#55a940]"
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>

                            <CardFooter className="flex flex-col space-y-4 pt-4 border-t border-[#323232] mt-6">
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#55a940] hover:bg-[#61ab4e] text-white font-bold py-5 shadow-lg shadow-emerald-900/30 transition-all duration-200"
                                >
                                    {loading 
                                        ? (isSignUp ? 'Creating Account...' : 'Signing In...') 
                                        : (isSignUp ? 'Sign Up' : 'Sign In')}
                                </Button>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleSwitchMode}
                                    className="w-full text-[#bbccb7] hover:text-white hover:bg-[#323232] text-sm"
                                >
                                    {isSignUp 
                                        ? 'Already have an account? Sign In' 
                                        : "Don't have an account? Sign Up"}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Auth;

