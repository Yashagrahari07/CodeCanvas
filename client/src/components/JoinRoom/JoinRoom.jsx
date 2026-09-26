import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import * as api from '../../api/api';
import toast from 'react-hot-toast';
import './styles.css';
import { Users, Plus, KeyRound, User as UserIcon, Sparkles, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const JoinRoom = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    // Pre-fill username if user is logged in
    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('profile'));
        if (profile?.result?.name) {
            setUsername(profile.result.name);
        }
    }, []);

    const createRoom = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.createRoom();
            setRoomId(data.roomId);
            toast.success('Generated a new Room ID!', { position: 'top-center' });
        } catch (err) {
            toast.error('Could not create a new room');
        } finally {
            setLoading(false);
        }
    };

    const joinRoom = () => {
        if (!roomId.trim() || !username.trim()) {
            toast.error('ROOM ID & username are required', { position: 'top-center' });
            return;
        }
        toast.success("Joining Room...", { position: 'top-center' });
        navigate(`/room/${roomId.trim()}`, {
            state: {
                username: username.trim(),
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter')
            joinRoom();
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#323232] text-[#e2e3e2]">
            <Navbar />

            <main className="flex-1 flex items-center justify-center p-4 py-12">
                <Card className="w-full max-w-md bg-[#2b2a2a] border-2 border-[#8ab180]/30 shadow-2xl shadow-black/50 text-[#e2e3e2]">
                    <CardHeader className="space-y-1 text-center pb-6 border-b border-[#323232]">
                        <CardTitle className="magic text-3xl font-extrabold tracking-wide flex items-center justify-center gap-2">
                            <Users className="h-7 w-7 text-[#55a940]" />
                            Collaborative Room
                        </CardTitle>
                        <CardDescription className="text-[#bbccb7] text-sm">
                            Paste an invitation Room ID to join real-time coding or create your own room.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-5 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="roomId" className="text-sm font-medium text-[#e2e3e2]">
                                Room ID
                            </Label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-[#8ab180]" />
                                <Input
                                    id="roomId"
                                    type="text"
                                    placeholder="Paste ROOM ID here..."
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    onKeyUp={handleInputEnter}
                                    className="pl-9 bg-[#323232] border-[#8ab180]/30 text-white placeholder:text-gray-400 focus:border-[#55a940] focus:ring-1 focus:ring-[#55a940]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-sm font-medium text-[#e2e3e2]">
                                Your Username
                            </Label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-3 h-4 w-4 text-[#8ab180]" />
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="Display name in room..."
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    onKeyUp={handleInputEnter}
                                    required
                                    className="pl-9 bg-[#323232] border-[#8ab180]/30 text-white placeholder:text-gray-400 focus:border-[#55a940] focus:ring-1 focus:ring-[#55a940]"
                                />
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4 pt-4 border-t border-[#323232] mt-4">
                        <Button
                            onClick={joinRoom}
                            className="w-full bg-[#55a940] hover:bg-[#61ab4e] text-white font-bold py-5 shadow-lg shadow-emerald-950/40 transition-all duration-200"
                        >
                            <LogIn className="h-4 w-4 mr-2" />
                            Join Room
                        </Button>

                        <div className="text-center pt-2 text-sm text-[#bbccb7] flex items-center justify-center gap-1.5 flex-wrap">
                            <span>Don't have an invite code?</span>
                            <Button
                                variant="link"
                                onClick={createRoom}
                                disabled={loading}
                                className="text-[#55a940] hover:text-[#61ab4e] p-0 font-bold underline"
                            >
                                {loading ? 'Creating...' : 'Create New Room'}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </main>

            <Footer />
        </div>
    );
};

export default JoinRoom;


