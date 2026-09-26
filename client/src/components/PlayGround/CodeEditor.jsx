import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import { updateCardCode, getCardDetails } from '../../api/api';
import { toast } from 'react-hot-toast';
import { downloadTextFile } from '../../service/download';
import { 
    Play, 
    Save, 
    Upload, 
    Download, 
    Maximize2, 
    Minimize2, 
    ArrowLeft, 
    FileCode2, 
    Palette, 
    Code2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';


const CodeEditor = ({ runCode }) => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const userId = user?.result?._id;
    const navigate = useNavigate();

    const [code, setCode] = useState('');
    const [theme, setTheme] = useState('vs-dark');
    const [lang, setLang] = useState('cpp');
    const [title, setTitle] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const params = useParams();
    const { folderId, fileId } = params;
    const codeRef = useRef('');

    const fileExtension = {
        cpp: {
            name: 'cpp',
            defaultCode: "#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << \"Hello World!\";\n\treturn 0;\n}",
        },
        python: {
            name: 'py',
            defaultCode: `print("Hello World!")`,
        },
        java: {
            name: 'java',
            defaultCode: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World!");\n    }\n}`,
        }, 
        javascript: {
            name: 'js',
            defaultCode: `console.log("Hello World!");`,
        }
    };

    useEffect(() => {
        let cancelled = false;
        const loadCode = async () => {
            try {
                const { data } = await getCardDetails(userId, folderId, fileId);
                if (cancelled) return;
                const normalizedLanguage = data.language === 'c++' ? 'cpp' : (data.language || 'cpp');
                setTitle(data.title || 'Untitled');
                setLang(normalizedLanguage);
                const initialCode = (data.code === '' || data.code === undefined)
                    ? (fileExtension[normalizedLanguage]?.defaultCode || '')
                    : data.code;
                setCode(initialCode);
                codeRef.current = initialCode;
            } catch (error) {
                if (!cancelled) toast.error(error?.response?.data?.message || 'Could not load code file');
            }
        };
        loadCode();
        return () => { cancelled = true; };
    }, [userId, folderId, fileId]);

    const onCodeChange = (newCode) => {
        setCode(newCode);
        codeRef.current = newCode;
    };

    const onLangChange = (newLang) => {
        setLang(newLang);
        if (!code || code === fileExtension[lang]?.defaultCode) {
            const nextCode = fileExtension[newLang]?.defaultCode || '';
            setCode(nextCode);
            codeRef.current = nextCode;
        }
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
            toast.success("Imported code file", { position: 'top-center' });
        };
    };

    const exportCode = () => {
        const codeVal = codeRef.current?.trim();
        if (!codeVal) {
            toast.error("Enter some code before exporting", { position: 'top-center' });
            return;
        }
        downloadTextFile(codeVal, `${title || 'code'}.${fileExtension[lang]?.name || lang}`);
    };

    const saveEditorCode = async () => {
        setIsSaving(true);
        try {
            await updateCardCode(userId, folderId, fileId, codeRef.current || '');
            toast.success("Code saved successfully!", { position: 'top-center' });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Could not save code');
        } finally {
            setIsSaving(false);
        }
    };

    const onRunCode = () => {
        if (codeRef.current !== undefined) {
            runCode({
                code: codeRef.current,
                language: lang,
            });
        } else {
            toast.error("No code to run", { position: 'top-center' });
        }
    };

    return (
        <div className={`flex flex-col h-full bg-[#1e1e1e] text-[#e2e3e2] ${isFullScreen ? 'fixed inset-0 z-50 bg-[#1e1e1e]' : 'relative'}`}>
            {/* Top Toolbar */}
            <div className="h-14 bg-[#2b2a2a] border-b border-[#323232] px-4 flex items-center justify-between gap-4 shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => navigate('/home')}
                        className="text-[#bbccb7] hover:text-white hover:bg-[#323232]"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    
                    <FileCode2 className="h-5 w-5 text-[#55a940] shrink-0" />
                    <h2 className="font-bold text-white text-base truncate max-w-[200px] sm:max-w-[300px]">
                        {title || 'Code Playground'}
                    </h2>

                    <Button 
                        size="sm" 
                        variant="outline"
                        onClick={saveEditorCode}
                        disabled={isSaving}
                        className="bg-[#323232] border-[#8ab180]/40 text-[#e2e3e2] hover:bg-[#55a940] hover:text-white text-xs font-semibold flex items-center gap-1.5"
                    >
                        <Save className="h-3.5 w-3.5" />
                        {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                </div>

                {/* Right controls: Language & Theme dropdowns */}
                <div className="flex items-center gap-2">
                    <Select value={lang} onValueChange={onLangChange}>
                        <SelectTrigger className="w-[120px] h-8 bg-[#323232] border-[#8ab180]/30 text-white text-xs">
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
                        <SelectTrigger className="w-[110px] h-8 bg-[#323232] border-[#8ab180]/30 text-white text-xs hidden sm:flex">
                            <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#2b2a2a] border-[#8ab180]/30 text-white text-xs">
                            <SelectItem value="vs-dark">VS Dark</SelectItem>
                            <SelectItem value="vs-light">VS Light</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Monaco Editor Container */}
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
                        padding: { top: 12, bottom: 12 }
                    }}
                    onChange={onCodeChange}
                    value={code}
                />
            </div>

            {/* Bottom Footer Actions */}
            <div className="h-12 bg-[#252526] border-t border-[#323232] px-4 flex items-center justify-between gap-2 shrink-0">
                <div className="flex items-center gap-2">
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setIsFullScreen(!isFullScreen)}
                        className="text-[#bbccb7] hover:text-white hover:bg-[#323232] text-xs flex items-center gap-1.5 h-8 px-2.5"
                    >
                        {isFullScreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                        <span className="hidden sm:inline">{isFullScreen ? "Minimize" : "Fullscreen"}</span>
                    </Button>

                    <Label 
                        htmlFor="file-import" 
                        className="cursor-pointer text-[#bbccb7] hover:text-white hover:bg-[#323232] text-xs flex items-center gap-1.5 h-8 px-2.5 rounded-md transition-colors"
                    >
                        <Upload className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Import</span>
                    </Label>
                    <input type="file" id="file-import" className="hidden" onChange={importCode} />

                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={exportCode}
                        className="text-[#bbccb7] hover:text-white hover:bg-[#323232] text-xs flex items-center gap-1.5 h-8 px-2.5"
                    >
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Export</span>
                    </Button>
                </div>

                <Button 
                    onClick={onRunCode}
                    className="bg-[#55a940] hover:bg-[#61ab4e] text-white font-bold h-8 px-5 text-xs shadow-md flex items-center gap-1.5"
                >
                    <Play className="h-3.5 w-3.5 fill-current" />
                    Run Code
                </Button>
            </div>
        </div>
    );
};

export default CodeEditor;

