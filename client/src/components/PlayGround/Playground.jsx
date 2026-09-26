import React, { useCallback, useEffect, useRef, useState } from 'react';
import './styles.css';
import CodeEditor from './CodeEditor';
import { formatExecutionResult, makeSubmission } from '../../service/service';
import { downloadTextFile } from '../../service/download';
import { toast } from 'react-hot-toast';
import { Download, Upload, Terminal, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const Playground = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [editorWidth, setEditorWidth] = useState(65); // percentage
    const [isResizing, setIsResizing] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const latestRunRef = useRef(0);

    const importInput = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fileReader = new FileReader();
        fileReader.readAsText(file);
        fileReader.onload = function (value) {
            const importedCode = value.target.result;
            setInput(importedCode);
            toast.success("Imported input data", { position: 'top-center' });
        };
    };

    const exportOutput = () => {
        const outVal = output.trim();
        if (!outVal) {
            toast.error("No output available to export", { position: 'top-center' });
            return;
        }
        downloadTextFile(outVal, 'output.txt');
        toast.success("Exported output to output.txt", { position: 'top-center' });
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

    const handleMouseDown = (e) => {
        setIsResizing(true);
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            const container = document.querySelector('.playground-main-container');
            if (!container) return;
            const containerWidth = container.offsetWidth;
            const newWidth = (e.clientX / containerWidth) * 100;
            if (newWidth >= 35 && newWidth <= 80) {
                setEditorWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, [isResizing]);

    return (
        <div className="playground-main-container flex h-screen w-screen bg-[#1e1e1e] overflow-hidden select-none">
            {/* Left Column: Monaco Code Editor */}
            <div 
                className="h-full flex flex-col min-w-0" 
                style={{ width: `${editorWidth}%` }}
            >
                <CodeEditor runCode={runCode} />
            </div>

            {/* Resizer Handle Bar */}
            <div 
                onMouseDown={handleMouseDown}
                className="w-2 bg-[#2b2a2a] hover:bg-[#55a940] cursor-col-resize flex items-center justify-center transition-colors shrink-0 z-10 group"
            >
                <div className="h-8 w-1 bg-gray-500 rounded-full group-hover:bg-white" />
            </div>

            {/* Right Column: Input / Output Panels */}
            <div 
                className="h-full flex flex-col min-w-0 bg-[#252526] border-l border-[#323232] text-[#e2e3e2]" 
                style={{ width: `${100 - editorWidth}%` }}
            >
                {/* Input Panel (Top half) */}
                <div className="flex-1 flex flex-col min-h-0 border-b border-[#323232]">
                    <div className="h-10 bg-[#2b2a2a] px-4 flex items-center justify-between border-b border-[#323232] shrink-0">
                        <span className="font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Terminal className="h-3.5 w-3.5 text-[#55a940]" /> Input (Stdin)
                        </span>

                        <Label 
                            htmlFor="import-stdin"
                            className="cursor-pointer text-xs text-[#8ab180] hover:text-white flex items-center gap-1 hover:underline"
                        >
                            <Upload className="h-3 w-3" /> Import
                        </Label>
                        <input type="file" id="import-stdin" className="hidden" onChange={importInput} />
                    </div>

                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type program input arguments here..."
                        className="flex-1 w-full p-3 bg-[#1e1e1e] text-white font-mono text-sm resize-none focus:outline-none focus:ring-0 placeholder:text-gray-500"
                    />
                </div>

                {/* Output Panel (Bottom half) */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="h-10 bg-[#2b2a2a] px-4 flex items-center justify-between border-b border-[#323232] shrink-0">
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
                        placeholder="Output will be displayed here after running code..."
                        className="flex-1 w-full p-3 bg-[#1e1e1e] text-[#bbccb7] font-mono text-sm resize-none focus:outline-none focus:ring-0 placeholder:text-gray-500"
                    />
                </div>
            </div>

            {/* Execution Loading Overlay */}
            {showLoader && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-white">
                    <Loader2 className="h-12 w-12 text-[#55a940] animate-spin" />
                    <p className="font-bold text-lg">Executing Code...</p>
                </div>
            )}
        </div>
    );
};

export default Playground;

