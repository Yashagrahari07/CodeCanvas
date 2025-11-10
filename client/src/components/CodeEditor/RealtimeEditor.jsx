import React, { useRef, useState, useEffect } from 'react';
import { BiFullscreen, BiImport, BiExport } from "react-icons/bi";
import { VscRunAll } from "react-icons/vsc";
import { Editor } from '@monaco-editor/react';
import './styles.css';
import ACTIONS from '../../actionTypes';
import { toast } from 'react-hot-toast';

const RealtimeEditor = ({ socketRef, roomId, OnChangeCode, onRunCode, onSaveCode }) => {
    const [code, setCode] = useState('');
    const [theme, setTheme] = useState('vs-dark');
    const [lang, setLang] = useState('javascript');
    const [isFullScreen, setIsFullScreen] = useState(false);
    const editorRef = useRef(null);
    const codeRef = useRef(null);
    const isRemoteChange = useRef(false); //to distinguish between the changes coming from server and the locally made changes while typing

    useEffect(() => {
        //console.log(socketRef.current)
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null && editorRef.current) {
                    const currentCode = editorRef.current.getValue();
                    if (code !== currentCode) {
                        isRemoteChange.current = true;
                        editorRef.current.setValue(code);
                    }
                }
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off(ACTIONS.CODE_CHANGE);
            }
        };
    }, [socketRef.current]);

    const handleEditorMount = (editor) => {
        editorRef.current = editor;
    
        editor.onDidChangeModelContent(() => {
            const newCode = editor.getValue();
            if (isRemoteChange.current) {
                isRemoteChange.current = false;  
            } 
            else{
                setCode(newCode);
                codeRef.current = newCode;
                OnChangeCode(newCode);
                
                // Emit the code change event to other clients
                socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                    roomId,
                    code: newCode,
                });
            }
        });
    };

    const onLangChange = (e) => {
        const newLang = e.target.value;
        setLang(newLang);
    };

    const onThemeChange = (e) => {
        const newTheme = e.target.value;
        setTheme(newTheme);
    };

    const importCode = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const type = file.type.includes("text") || file.name.endsWith('.js') || file.name.endsWith('.py') || file.name.endsWith('.cpp') || file.name.endsWith('.java');
        if (type) {
            const fileReader = new FileReader();
            fileReader.readAsText(file);
            fileReader.onload = function (value) {
                const importedCode = value.target.result;
                setCode(importedCode);
                codeRef.current = importedCode;
                OnChangeCode(importedCode);
                // Emit the code change to other clients
                if (socketRef.current) {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code: importedCode,
                    });
                }
            }
        } else {
            toast((t) => (
                <span>
                  Please choose a program file
                  <button style={{borderRadius:'50%',padding:'1vh', border: 'none', marginLeft:'1vh',background:'#5a9a4a',color:'white'}} onClick={() => toast.dismiss(t.id)}>
                    OK
                  </button>
                </span>
              ),{
                position:'top-center',
                duration:3000
              });
        }
    };

    const exportCode = () => {
        const codeVal = codeRef.current?.trim();
        if (!codeVal) {
            toast((t) => (
                <span>
                  Enter some code before exporting
                  <button style={{borderRadius:'50%',padding:'1vh', border: 'none', marginLeft:'1vh',background:'#5a9a4a',color:'white'}} onClick={() => toast.dismiss(t.id)}>
                    OK
                  </button>
                </span>
              ),{
                position:'top-center',
                duration:3000
              });
            return;
        }
        const fileExtension = {
            cpp: 'cpp',
            python: 'py',
            java: 'java',
            javascript: 'js'
        };
        const codeBlob = new Blob([codeVal], { type: "text/plain" });
        const url = URL.createObjectURL(codeBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `code.${fileExtension[lang] || lang}`;
        link.click();
    };

    const handleRunCode = () => {
        if (codeRef.current && onRunCode) {
            onRunCode({
                code: codeRef.current,
                language: lang,
            });
        } else {
            toast.error("Code not found", {
                position: 'top-center'
            });
        }
    };

    const handleSaveCode = () => {
        if (onSaveCode && codeRef.current) {
            onSaveCode(codeRef.current);
        } else {
            toast.error("Save functionality not available", {
                position: 'top-center'
            });
        }
    };

    const fullScreen = () => {
        setIsFullScreen(!isFullScreen);
    };

    const styles = {
        fullScreen: {
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 10,
            width: '100vw'
        },
        minimise: {
            width:'80vw'
        },
    };

    return (
        <div className='rt-editor' style={isFullScreen ? styles.fullScreen : styles.minimise}>
            <div className='rt-editor-header'>
                <div className='right'>
                    <select onChange={onLangChange} value={lang}>
                        <option value="cpp">cpp</option>
                        <option value="javascript">javascript</option>
                        <option value="java">java</option>
                        <option value="python">python</option>
                    </select>
                    <select onChange={onThemeChange} value={theme}>
                        <option value="vs-dark">vs-dark</option>
                        <option value="vs-light">vs-light</option>
                    </select>
                </div>
                <div className='left'>
                    <button onClick={fullScreen}><BiFullscreen /> {isFullScreen ? "Minimise" : "FullScreen"}</button>
                    <label htmlFor='import-room'>
                        <BiImport /> Import
                    </label>
                    <input type='file' id='import-room' style={{display:'none'}} onChange={importCode} />
                    <button onClick={exportCode}><BiExport /> Export </button>
                    {onSaveCode && <button onClick={handleSaveCode}>Save Code</button>}
                    {onRunCode && <button onClick={handleRunCode}><VscRunAll /> Run </button>}
                </div>
            </div>
            <Editor
                theme={theme}
                height={'100%'}
                language={lang}
                options={{fontSize: 16 }}
                value={code}
                onMount={handleEditorMount}
            />
        </div>
    );
};

export default RealtimeEditor;
