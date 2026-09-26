import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import initSocket from '../../socket.js';
import Client from './Client.jsx';
import './styles.css';
import ACTIONS from '../../actionTypes.js';
import toast from 'react-hot-toast';
import RealtimeEditor from '../CodeEditor/RealtimeEditor.jsx';
import { formatExecutionResult, makeSubmission } from '../../service/service.js';
import { downloadTextFile } from '../../service/download.js';
import { 
    Copy, 
    LogOut, 
    Users, 
    Terminal, 
    Upload, 
    Download, 
    Loader2, 
    Code2,
    Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

const Room = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const { roomId } = useParams();
    const [clients, setClients] = useState([]);
    const [socket, setSocket] = useState(null);
    const [initialCode, setInitialCode] = useState(null);
    const codeRef = useRef(null);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const latestRunRef = useRef(0);

    const handleRoomCodeChange = useCallback((code) => {
        codeRef.current = code;
    }, []);

    useEffect(() => {
        let cancelled = false;
        const init = async () => {
            try {
                const connectedSocket = await initSocket();
                if (cancelled) {
                    connectedSocket.disconnect();
                    return;
                }
                socketRef.current = connectedSocket;
                setSocket(connectedSocket);
                connectedSocket.on("connect_error", (err) => {
                    toast.error(`Room connection failed: ${err.message}`);
                });

                const joinCurrentRoom = () => {
                    connectedSocket.emit(ACTIONS.JOIN, {
                        roomId,
                        username: location.state?.username || 'Anonymous',
                    });
                };
                connectedSocket.on('connect', joinCurrentRoom);

                connectedSocket.on(ACTIONS.JOINED, ({ clients, username, socketId, code }) => {
                    if (username !== (location.state?.username || 'Anonymous')) {
                        toast.success(`${username} joined the room`, { position: 'top-center' });
                    }
                    setClients(clients);
                    if (typeof code === 'string') {
                        setInitialCode(code);
                    }
                    if (typeof codeRef.current === 'string') {
                        connectedSocket.emit(ACTIONS.SYNC_CODE, {
                            roomId,
                            code: codeRef.current,
                            socketId,
                        });
                    }
                });

                connectedSocket.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                    toast.success(`${username} left the room`, { position: 'top-center' });
                    setClients((prev) => prev.filter((client) => client.socketId !== socketId));
                });

                if (connectedSocket.connected) joinCurrentRoom();

            } catch (err) {
                toast.error('Could not connect to the room');
                navigate('/join-room');
            }
        };

        init();
        return () => {
            cancelled = true;
            const currentSocket = socketRef.current;
            if (currentSocket) {
                currentSocket.off('connect');
                currentSocket.off(ACTIONS.JOINED);
                currentSocket.off(ACTIONS.DISCONNECTED);
                currentSocket.disconnect();
            }
            setSocket(null);
        };
    }, [roomId, location.state?.username, navigate]);

    const copyRoomId = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            toast.success('Copied Room ID to clipboard!', { position: 'top-center' });
        } catch (err) {
            toast.error('Could not copy the Room ID');
        }
    };

    const leaveRoom = () => {
        navigate('/home');
    };

    const importInput = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = function (value) {
            const importedInput = value.target.result;
            setInput(importedInput);
            toast.success("Imported input file", { position: 'top-center' });
        };
    };

    const exportOutput = () => {
        const outVal = output.trim();
        if (!outVal) {
            toast.error("No output available to export", { position: 'top-center' });
            return;
        }
        downloadTextFile(outVal, 'room_output.txt');
    };

    const callback = useCallback(({ apiStatus, data, message }) => {
        if (apiStatus === 'loading') {
            setShowLoader(true);
        } else if (apiStatus === 'error') {
            setShowLoader(false);
            setOutput("Something went wrong: " + message);
        } else {
            setShowLoader(false);
            setOutput(formatExecutionResult(data));
        }
    }, []);

    const runCode = useCallback(({ code, language }) => {
        const runId = ++latestRunRef.current;
        makeSubmission({
            code,
            language,
            stdin: input,
            callback,
            isCurrent: () => runId === latestRunRef.current,
        });
    }, [input, callback]);

    const saveCode = (code) => {
        localStorage.setItem(`codecanvas:room:${roomId}`, code);
        toast.success("Code saved to local browser storage!", { position: 'top-center' });
    };

    return (
        <div className="flex h-screen w-screen bg-[#1e1e1e] overflow-hidden select-none">
            {/* Sidebar (Left column) */}
            <aside className="w-64 bg-[#2b2a2a] border-r border-[#323232] flex flex-col justify-between shrink-0 p-4">
                <div className="flex flex-col h-full min-h-0">
                    {/* Header */}
                    <div className="pb-4 border-b border-[#323232]">
                        <div className="flex items-center justify-between">
                            <h3 className="font-extrabold text-white text-lg tracking-wide flex items-center gap-2">
                                <Users className="h-5 w-5 text-[#55a940]" />
                                Connected
                            </h3>
                            <Badge className="bg-[#55a940] text-white">
                                {clients.length} {clients.length === 1 ? 'user' : 'users'}
                            </Badge>
                        </div>
                        <p className="text-xs text-[#bbccb7] mt-1 truncate" title={`Room: ${roomId}`}>
                            Room: <span className="font-mono text-white">{roomId}</span>
                        </p>
                    </div>

                    {/* Connected Clients List */}
                    <div className="flex-1 overflow-y-auto my-4 space-y-2 pr-1 custom-scrollbar">
                        {clients?.map((client) => (
                            <Client key={client.socketId} username={client.username} />
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-[#323232] flex flex-col gap-2 shrink-0">
                        <Button
                            variant="outline"
                            onClick={copyRoomId}
                            className="w-full bg-[#323232] border-[#8ab180]/40 text-[#e2e3e2] hover:bg-[#55a940] hover:text-white font-semibold text-xs justify-start gap-2"
                        >
                            <Copy className="h-4 w-4" /> Copy Room ID
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={leaveRoom}
                            className="w-full bg-red-600/80 hover:bg-red-700 text-white font-semibold text-xs justify-start gap-2"
                        >
                            <LogOut className="h-4 w-4" /> Leave Room
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Central Column: Monaco Realtime Editor */}
            <div className="flex-1 min-w-0 flex flex-col h-full">
                <RealtimeEditor 
                    socket={socket}
                    initialCode={initialCode}
                    socketRef={socketRef}
                    roomId={roomId}
                    OnChangeCode={handleRoomCodeChange}
                    onRunCode={runCode}
                    onSaveCode={saveCode}
                />
            </div>

            {/* Right Column: Input / Output Panels */}
            <div className="w-80 h-full bg-[#252526] border-l border-[#323232] flex flex-col shrink-0 text-[#e2e3e2]">
                {/* Input Panel */}
                <div className="flex-1 flex flex-col min-h-0 border-b border-[#323232]">
                    <div className="h-10 bg-[#2b2a2a] px-3 flex items-center justify-between border-b border-[#323232] shrink-0">
                        <span className="font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Terminal className="h-3.5 w-3.5 text-[#55a940]" /> Input (Stdin)
                        </span>

                        <Label 
                            htmlFor="room-stdin"
                            className="cursor-pointer text-xs text-[#8ab180] hover:text-white flex items-center gap-1 hover:underline"
                        >
                            <Upload className="h-3 w-3" /> Import
                        </Label>
                        <input type="file" id="room-stdin" className="hidden" onChange={importInput} />
                    </div>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type room execution input arguments here..."
                        className="flex-1 w-full p-3 bg-[#1e1e1e] text-white font-mono text-sm resize-none focus:outline-none focus:ring-0 placeholder:text-gray-500"
                    />
                </div>

                {/* Output Panel */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="h-10 bg-[#2b2a2a] px-3 flex items-center justify-between border-b border-[#323232] shrink-0">
                        <span className="font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Terminal className="h-3.5 w-3.5 text-[#55a940]" /> Output (Stdout)
                        </span>

                        <button 
                            onClick={exportOutput}
                            className="text-xs text-[#8ab180] hover:text-white flex items-center gap-1 hover:underline"
                        >
                            <Download className="h-3 w-3" /> Export
                        </button>
                    </div>

                    <textarea
                        readOnly
                        value={output}
                        placeholder="Room code output will appear here..."
                        className="flex-1 w-full p-3 bg-[#1e1e1e] text-[#bbccb7] font-mono text-sm resize-none focus:outline-none focus:ring-0 placeholder:text-gray-500"
                    />
                </div>
            </div>

            {/* Execution Loader Overlay */}
            {showLoader && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-white">
                    <Loader2 className="h-12 w-12 text-[#55a940] animate-spin" />
                    <p className="font-bold text-lg">Running Room Code...</p>
                </div>
            )}
        </div>
    );
};

export default Room;

