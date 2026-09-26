import React, { useEffect, useState } from 'react';
import logo from '../../assets/logoCode.png';
import './styles.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, LogOut, Home as HomeIcon, Users, Info, LogIn, UserPlus } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const Navbar = () => {
    const [login, setLogin] = useState(false);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('profile'));
        setLogin(!!user);
    }, [location]);
    
    const handleLogout = () => {
        localStorage.removeItem('profile');
        setLogin(false);
        setOpen(false);
        navigate('/');
    };

    const handleNav = (path) => {
        setOpen(false);
        navigate(path);
    };

    const isOnAuthPage = location.pathname === '/auth';
    const searchParams = new URLSearchParams(location.search);
    const authMode = searchParams.get('mode') || 'signup';
    const isLoginMode = authMode === 'login';

    const renderAuthButton = (isMobile = false) => {
        if (!isOnAuthPage) {
            return (
                <button 
                    className="menubuts text-white hover:text-white" 
                    onClick={() => handleNav('/auth?mode=login')}
                >
                    Login
                </button>
            );
        } else {
            if (isLoginMode) {
                return (
                    <button 
                        className="menubuts text-white hover:text-white" 
                        onClick={() => handleNav('/auth?mode=signup')}
                    >
                        SignUp
                    </button>
                );
            } else {
                return (
                    <button 
                        className="menubuts text-white hover:text-white" 
                        onClick={() => handleNav('/auth?mode=login')}
                    >
                        Login
                    </button>
                );
            }
        }
    };

    return (
        <div className="sticky top-0 z-50 w-full">
            <header className="navbar flex h-[9vh] min-h-[60px] w-full items-center justify-between bg-[#2b2a2a] px-4 md:px-8 shadow-md">
                {/* Logo & Brand */}
                <div 
                    className="app-icon flex cursor-pointer items-center gap-3 origin-left transition-transform duration-200 hover:scale-105 select-none" 
                    onClick={() => navigate('/')}
                >
                    <img src={logo} alt="CodeCanvas Logo" className="h-[6vh] min-h-[38px] w-[6vh] min-w-[38px] object-contain shrink-0" />
                    <h1 className="magic text-2xl font-bold tracking-wide md:text-3xl whitespace-nowrap">CodeCanvas</h1>
                </div>


                {/* Desktop Navigation */}
                <nav className="button-container hidden items-center gap-2 md:flex">
                    {login && (
                        <button className="menubuts" onClick={() => handleNav('/home')}>
                            Home
                        </button>
                    )}
                    {!login && renderAuthButton()}
                    {login && (
                        <button className="menubuts" onClick={() => handleNav('/join-room')}>
                            Join Room
                        </button>
                    )}
                    {login && (
                        <button className="menubuts" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                    <button className="menubuts" onClick={() => handleNav('/about')}>
                        About Us
                    </button>
                </nav>

                {/* Mobile Navigation Drawer */}
                <div className="md:hidden">
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-[#e2e3e2] hover:bg-[#323232]">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle Navigation Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-[#2b2a2a] text-[#e2e3e2] border-[#323232] w-[280px]">
                            <SheetHeader className="mb-6 border-b border-[#323232] pb-4">
                                <SheetTitle className="magic text-2xl font-bold flex items-center gap-2">
                                    <img src={logo} alt="Logo" className="h-7 w-7" />
                                    CodeCanvas
                                </SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-2.5 items-center w-full">
                                {login && (
                                    <Button 
                                        variant="outline" 
                                        className="w-[88%] justify-start gap-3 bg-[#323232] border-emerald-600/30 text-[#e2e3e2] hover:bg-[#55a940] hover:text-white rounded-lg transition-all"
                                        onClick={() => handleNav('/home')}
                                    >
                                        <HomeIcon className="h-4 w-4 text-[#55a940]" /> Home
                                    </Button>
                                )}
                                {!login && (
                                    <Button 
                                        variant="outline" 
                                        className="w-[88%] justify-start gap-3 bg-[#323232] border-emerald-600/30 text-[#e2e3e2] hover:bg-[#55a940] hover:text-white rounded-lg transition-all"
                                        onClick={() => handleNav(isOnAuthPage && isLoginMode ? '/auth?mode=signup' : '/auth?mode=login')}
                                    >
                                        {isOnAuthPage && isLoginMode ? <UserPlus className="h-4 w-4 text-[#55a940]" /> : <LogIn className="h-4 w-4 text-[#55a940]" />}
                                        {isOnAuthPage && isLoginMode ? 'Sign Up' : 'Login'}
                                    </Button>
                                )}
                                {login && (
                                    <Button 
                                        variant="outline" 
                                        className="w-[88%] justify-start gap-3 bg-[#323232] border-emerald-600/30 text-[#e2e3e2] hover:bg-[#55a940] hover:text-white rounded-lg transition-all"
                                        onClick={() => handleNav('/join-room')}
                                    >
                                        <Users className="h-4 w-4 text-[#55a940]" /> Join Room
                                    </Button>
                                )}
                                <Button 
                                    variant="outline" 
                                    className="w-[88%] justify-start gap-3 bg-[#323232] border-emerald-600/30 text-[#e2e3e2] hover:bg-[#55a940] hover:text-white rounded-lg transition-all"
                                    onClick={() => handleNav('/about')}
                                >
                                    <Info className="h-4 w-4 text-[#55a940]" /> About Us
                                </Button>
                                {login && (
                                    <Button 
                                        variant="destructive" 
                                        className="w-[88%] justify-start gap-3 mt-2 bg-red-600/80 hover:bg-red-700 text-white rounded-lg transition-all"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="h-4 w-4" /> Logout
                                    </Button>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </header>
            <div className="navgrad"></div>
        </div>
    );

};

export default Navbar;

