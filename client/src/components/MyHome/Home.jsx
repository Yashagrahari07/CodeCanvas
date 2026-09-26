import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import logo from '../../assets/logoCode.png';
import Modal from './Modal';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import { getData, deleteWorkspace, deleteCardFromWorkspace } from '../../api/api';
import { toast } from 'react-hot-toast';
import {
    Folder,
    FolderPlus,
    FilePlus,
    Trash2,
    Edit,
    Code2,
    FileCode,
    ChevronRight,
    Sparkles,
    FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Home = () => {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState({ state: false });
    const user = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, [user, navigate]);

    const userId = user?.result?._id;
    const [m, setM] = useState(1);
    const [allWs, setWs] = useState([]);
    const [currentWsId, setCurrentWsId] = useState(null);
    const [currentCardId, setCurrentCardId] = useState(null);
    const [showLoader, setShowLoader] = useState(false);

    const getList = async () => {
        setShowLoader(true);
        try {
            const list = await getData(userId);
            setWs(list.data || []);
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Could not load workspace folders');
        } finally {
            setShowLoader(false);
        }
    };

    useEffect(() => {
        if (userId) getList();
    }, [userId]);

    const deleteWs = async (wsId, wsTitle) => {
        toast((t) => (
            <div className="flex flex-col gap-3 p-1">
                <p className="font-semibold text-white">Delete folder "{wsTitle}" and all its files?</p>
                <div className="flex justify-end gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-[#323232] border-gray-600 text-white hover:bg-gray-700"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await deleteWorkspace(userId, wsId);
                                toast.success('Deleted Folder');
                                await getList();
                            } catch (error) {
                                toast.error(error?.response?.data?.message || 'Could not delete folder');
                            }
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        ), {
            position: 'top-center',
            duration: 8000,
            style: { background: '#2b2a2a', color: '#fff', border: '1px solid #55a940' }
        });
    };

    const editWsname = (wsId) => {
        setCurrentWsId(wsId);
        setM(3);
        setOpenModal({ state: true });
    };

    const addCard = (wsId) => {
        setCurrentWsId(wsId);
        setM(2);
        setOpenModal({ state: true });
    };

    const editCardName = (wsId, cardId) => {
        setCurrentWsId(wsId);
        setCurrentCardId(cardId);
        setM(4);
        setOpenModal({ state: true });
    };

    const deleteCard = async (wsId, cardId, cardTitle) => {
        toast((t) => (
            <div className="flex flex-col gap-3 p-1">
                <p className="font-semibold text-white">Delete file "{cardTitle}"?</p>
                <div className="flex justify-end gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        className="bg-[#323232] border-gray-600 text-white hover:bg-gray-700"
                        onClick={() => toast.dismiss(t.id)}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white font-bold"
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                await deleteCardFromWorkspace(userId, wsId, cardId);
                                toast.success('Deleted File');
                                await getList();
                            } catch (error) {
                                toast.error(error?.response?.data?.message || 'Could not delete file');
                            }
                        }}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        ), {
            position: 'top-center',
            duration: 8000,
            style: { background: '#2b2a2a', color: '#fff', border: '1px solid #55a940' }
        });
    };

    const getLangBadgeColor = (lang) => {
        const l = (lang || '').toLowerCase();
        if (l.includes('cpp') || l.includes('c++')) return 'bg-blue-600/30 text-blue-300 border-blue-500/40';
        if (l.includes('py')) return 'bg-amber-600/30 text-amber-300 border-amber-500/40';
        if (l.includes('js') || l.includes('javascript')) return 'bg-yellow-600/30 text-yellow-300 border-yellow-500/40';
        if (l.includes('java')) return 'bg-orange-600/30 text-orange-300 border-orange-500/40';
        return 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40';
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#323232] text-[#e2e3e2]">
            <Navbar />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8">
                {/* Header Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#8ab180]/20 mb-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            My <span className="magic">Folders</span>
                        </h1>
                        <p className="text-sm text-[#bbccb7] mt-1">
                            Organize your coding workspaces and projects.
                        </p>
                    </div>

                    <Button
                        onClick={() => { setM(1); setOpenModal({ state: true }); }}
                        className="bg-[#55a940] hover:bg-[#61ab4e] text-white font-bold px-6 py-5 shadow-lg shadow-emerald-950/40 flex items-center gap-2 transition-all duration-200 hover:scale-105"
                    >
                        <FolderPlus className="h-5 w-5" />
                        New Folder
                    </Button>
                </div>

                {/* Content / Skeleton / Empty state */}
                {showLoader ? (
                    <div className="space-y-6">
                        {[1, 2].map((i) => (
                            <div key={i} className="bg-[#2b2a2a] p-6 rounded-xl border border-[#8ab180]/20 space-y-4">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-8 w-48 bg-[#323232]" />
                                    <Skeleton className="h-9 w-24 bg-[#323232]" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {[1, 2, 3].map((j) => (
                                        <Skeleton key={j} className="h-32 w-full bg-[#323232] rounded-lg" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : allWs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center bg-[#2b2a2a]/60 border-2 border-dashed border-[#8ab180]/30 rounded-2xl p-8">
                        <FolderOpen className="h-16 w-16 text-[#55a940] mb-4 animate-bounce" />
                        <h2 className="text-2xl font-bold text-white mb-2">No folders created yet</h2>
                        <p className="text-[#bbccb7] max-w-md mb-6">
                            Start by creating your first folder workspace to organize your code files.
                        </p>
                        <Button
                            onClick={() => { setM(1); setOpenModal({ state: true }); }}
                            className="bg-[#55a940] hover:bg-[#61ab4e] text-white font-bold px-6 py-5 shadow-lg shadow-emerald-950/40"
                        >
                            <FolderPlus className="h-5 w-5 mr-2" />
                            Create First Folder
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {allWs.map((ws) => (
                            <Card key={ws._id} className="bg-[#2b2a2a] border-2 border-[#8ab180]/30 shadow-xl overflow-hidden text-[#e2e3e2] py-0 p-0">
                                {/* Folder Header */}
                                <CardHeader className="bg-[#262525] border-b border-[#323232] py-3.5 px-6 flex flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <Folder className="h-7 w-7 text-[#55a940] shrink-0" />
                                        <CardTitle className="text-xl md:text-2xl font-bold text-white tracking-wide">
                                            {ws.title}
                                        </CardTitle>
                                        <Badge variant="outline" className="ml-2 border-[#55a940]/50 text-[#8ab180] bg-[#323232]">
                                            {ws.cards?.length || 0} {ws.cards?.length === 1 ? 'file' : 'files'}
                                        </Badge>
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => editWsname(ws._id)}
                                            title="Rename folder"
                                            className="text-[#bbccb7] hover:text-white hover:bg-[#323232]"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => deleteWs(ws._id, ws.title)}
                                            title="Delete folder"
                                            className="text-[#bbccb7] hover:text-red-400 hover:bg-[#323232]"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => addCard(ws._id)}
                                            className="bg-[#55a940] hover:bg-[#61ab4e] text-white font-semibold flex items-center gap-1.5 text-xs md:text-sm"
                                        >
                                            <FilePlus className="h-4 w-4" />
                                            New File
                                        </Button>
                                    </div>
                                </CardHeader>

                                {/* Folder Cards / Files Grid */}
                                <CardContent className="p-6">
                                    {!ws.cards || ws.cards.length === 0 ? (
                                        <div className="text-center py-8 text-[#bbccb7] bg-[#323232]/40 rounded-lg border border-dashed border-[#8ab180]/20 flex flex-col items-center justify-center gap-2">
                                            <FileCode className="h-8 w-8 text-[#8ab180]/60" />
                                            <p className="text-sm">Folder is empty. Add a code file to get started.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            {ws.cards.map((card) => (
                                                <div
                                                    key={card._id}
                                                    className="group relative bg-[#323232] hover:bg-[#383838] border border-[#8ab180]/30 hover:border-[#55a940] rounded-xl p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between cursor-pointer"
                                                >
                                                    {/* Card Content Click Area */}
                                                    <div
                                                        onClick={() => navigate(`/playground/${ws._id}/${card._id}`)}
                                                        className="flex items-start gap-3 mb-4"
                                                    >
                                                        <div className="p-2 rounded-lg bg-[#2b2a2a] group-hover:bg-[#55a940] group-hover:text-white transition-colors">
                                                            <img src={logo} alt="Logo" className="h-6 w-6 object-contain" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="font-bold text-white text-base truncate group-hover:text-[#55a940] transition-colors">
                                                                {card.title}
                                                            </h4>
                                                            <Badge className={`mt-1 text-xs border ${getLangBadgeColor(card.language)}`}>
                                                                {card.language}
                                                            </Badge>
                                                        </div>
                                                    </div>

                                                    {/* Card Footer Actions */}
                                                    <div className="flex items-center justify-between pt-3 border-t border-[#2b2a2a] text-[#bbccb7]">
                                                        <span
                                                            onClick={() => navigate(`/playground/${ws._id}/${card._id}`)}
                                                            className="text-xs font-semibold hover:underline flex items-center text-[#8ab180]"
                                                        >
                                                            Open Editor <ChevronRight className="h-3 w-3 ml-0.5" />
                                                        </span>

                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); editCardName(ws._id, card._id); }}
                                                                className="p-1 hover:text-white hover:bg-[#2b2a2a] rounded transition-colors"
                                                                title="Rename file"
                                                            >
                                                                <Edit className="h-3.5 w-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); deleteCard(ws._id, card._id, card.title); }}
                                                                className="p-1 hover:text-red-400 hover:bg-[#2b2a2a] rounded transition-colors"
                                                                title="Delete file"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {openModal.state && (
                <Modal
                    openModal={m}
                    setOpenModal={setOpenModal}
                    wsId={currentWsId}
                    cardId={currentCardId}
                    getLists={getList}
                />
            )}

            <Footer />
        </div>
    );
};

export default Home;
