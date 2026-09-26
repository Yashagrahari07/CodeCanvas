import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import './styles.css';
import ACTIONS from '../../actionTypes';
import { toast } from 'react-hot-toast';
import { downloadTextFile } from '../../service/download';
import { 
    Play, 
    Save, 
    Upload, 
    Download, 
    Maximize2, 
    Minimize2, 
    Code2, 
    Palette 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const RealtimeEditor = ({ socket, roomId, initialCode, OnChangeCode, onRunCode, onSaveCode }) => {
    const [code, setCode] = useState('');
    const [theme, setTheme] = useState('vs-dark');
    const [lang, setLang] = useState('javascript');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const editorRef = useRef(null);
    const codeRef = useRef(null);
    const socketRef = useRef(socket);
    const pendingCodeRef = useRef(null);
    const isRemoteChange = useRef(false);

    useEffect(() => {
        socketRef.current = socket;
    }, [socket]);

    useEffect(() => () => clearTimeout(pendingCodeRef.current), []);

    const emitCodeChange = (newCode, immediate = false) => {
        clearTimeout(pendingCodeRef.current);
        if (immediate) {
            socketRef.current?.emit(ACTIONS.CODE_CHANGE, { roomId, code: newCode });
            return;
        }
        pendingCodeRef.current = setTimeout(() => {
            socketRef.current?.emit(ACTIONS.CODE_CHANGE, { roomId, code: newCode });
        }, 100);
    };

    useEffect(() => {
        if (typeof initialCode !== 'string') return;

        setCode(initialCode);
        codeRef.current = initialCode;
        OnChangeCode(initialCode);
        if (editorRef.current && editorRef.current.getValue() !== initialCode) {
            isRemoteChange.current = true;
            editorRef.current.setValue(initialCode);
        }
    }, [initialCode, OnChangeCode]);

    useEffect(() => {
        if (socket) {
            const handleCodeChange = ({ code }) => {
                if (typeof code === 'string') {
                    const currentCode = editorRef.current?.getValue();
                    if (code !== currentCode) {
                        setCode(code);
                        codeRef.current = code;
                        OnChangeCode(code);
                        if (editorRef.current) {
                            isRemoteChange.current = true;
                            editorRef.current.setValue(code);
                        }
                    }
                }
            };
            socket.on(ACTIONS.CODE_CHANGE, handleCodeChange);
            return () => socket.off(ACTIONS.CODE_CHANGE, handleCodeChange);
        }
    }, [socket, OnChangeCode]);

    const handleEditorMount = (editor) => {
        editorRef.current = editor;
    
        editor.onDidChangeModelContent(() => {
            const newCode = editor.getValue();
            if (isRemoteChange.current) {
                isRemoteChange.current = false;  
            } else {
                setCode(newCode);
                codeRef.current = newCode;
                OnChangeCode(newCode);
                emitCodeChange(newCode);
            }
        });
    };

    const importCode = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = function (value) {
            const importedCode = value.target.result;
            setCode(importedCode);
            codeRef.current = importedCode;
            OnChangeCode(importedCode);
            emitCodeChange(importedCode, true);
            toast.success("Imported code into room", { position: 'top-center' });
        };
    };

    const exportCode = () => {
        const codeVal = codeRef.current?.trim();
        if (!codeVal) {
            toast.error("Enter some code before exporting", { position: 'top-center' });
            return;
        }
        const fileExtension = {
            cpp: 'cpp',
            python: 'py',
            java: 'java',
            javascript: 'js'
        };
        downloadTextFile(codeVal, `room_code.${fileExtension[lang] || lang}`);
    };

    const handleRunCode = () => {
        if (codeRef.current && onRunCode) {
            onRunCode({
                code: codeRef.current,
                language: lang,
            });
        } else {
            toast.error("No code to run", { position: 'top-center' });
        }
    };

    const handleSaveCode = () => {
        if (onSaveCode && codeRef.current) {
            onSaveCode(codeRef.current);
        } else {
            toast.error("Save functionality not available", { position: 'top-center' });
        }
    };

    return (
        <div className={`flex flex-col h-full bg-[#1e1e1e] text-[#e2e3e2] ${isFullScreen ? 'fixed inset-0 z-50 bg-[#1e1e1e]' : 'relative'}`}>
            {/* Header Control Toolbar */}
            <div className="h-12 bg-[#2b2a2a] border-b border-[#323232] px-3 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                    <Select value={lang} onValueChange={setLang}>
                        <SelectTrigger className="w-[110px] h-8 bg-[#323232] border-[#8ab180]/30 text-white text-xs">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2b2a2a] border-[#8ab180]/30 text-white text-xs">
                            <SelectItem value="cpp">C++</SelectItem>
                            <SelectItem value="javascript">JavaScript</SelectItem>
                            <SelectItem value="python">Python 3</SelectItem>
                            <SelectItem value="java">Java</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="w-[100px] h-8 bg-[#323232] border-[#8ab180]/30 text-white text-xs hidden sm:flex">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2b2a2a] border-[#8ab180]/30 text-white text-xs">
                            <SelectItem value="vs-dark">VS Dark</SelectItem>
                            <SelectItem value="vs-light">VS Light</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-1.5">
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className="text-[#bbccb7] hover:text-white hover:bg-[#323232] text-xs h-8 px-2"
                        title="Toggle Fullscreen"
                    >
                        {isFullScreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                    </Button>

                    <Label 
                        htmlFor="rt-import" 
                        className="cursor-pointer text-[#bbccb7] hover:text-white hover:bg-[#323232] text-xs flex items-center gap-1 h-8 px-2 rounded-md transition-colors"
                        title="Import Code"
                    >
                        <Upload className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">Import</span>
                    </Label>
                    <input type="file" id="rt-import" className="hidden" onChange={importCode} />

                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={exportCode}
                        className="text-[#bbccb7] hover:text-white hover:bg-[#323232] text-xs h-8 px-2"
                        title="Export Code"
                    >
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden md:inline">Export</span>
                    </Button>

                    {onSaveCode && (
                        <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={handleSaveCode}
                            className="bg-[#323232] border-[#8ab180]/30 text-[#e2e3e2] hover:bg-[#55a940] hover:text-white text-xs h-8 px-2.5"
                        >
                            <Save className="h-3.5 w-3.5 mr-1" /> Save
                        </Button>
                    )}

                    {onRunCode && (
                        <Button 
                            size="sm" 
                            onClick={handleRunCode}
                            className="bg-[#55a940] hover:bg-[#61ab4e] text-white font-bold h-8 px-3 text-xs shadow-md"
                        >
                            <Play className="h-3.5 w-3.5 mr-1 fill-current" /> Run
                        </Button>
                    )}
                </div>
            </div>

            {/* Monaco Realtime Editor Instance */}
            <div className="flex-1 min-h-0 w-full relative">
                <Editor
                    theme={theme}
                    height="100%"
                    language={lang}
                    options={{
                        fontSize: 15,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 4,
                        padding: { top: 10, bottom: 10 }
                    }}
                    value={code}
                    onMount={handleEditorMount}
                />
            </div>
        </div>
    );
};

export default RealtimeEditor;

