import React, { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { BiFullscreen, BiImport,BiExport } from "react-icons/bi";
import { VscRunAll } from "react-icons/vsc";
import {Editor} from '@monaco-editor/react';
import { updateCardCode,getCardDetails } from '../../api/api';
import { toast } from 'react-hot-toast';
import { downloadTextFile } from '../../service/download';

const CodeEditor = ({runCode}) => {
   const user=JSON.parse(localStorage.getItem('profile'));
   const userId=user?.result?._id;

   const [code,setCode]=useState('');
   const [theme, setTheme] = useState('vs-dark');
   const [lang,setLang]=useState('');
   const [title, setTitle]=useState('');

   const [isFullScreen, setIsFullScreen]=useState(false);

   const params=useParams();
   const {folderId,fileId}=params;
  
   useEffect(() => {
                let cancelled = false;
                const loadCode = async () => {
                    try {
                        const { data } = await getCardDetails(userId, folderId, fileId);
                        if (cancelled) return;
                        const normalizedLanguage = data.language === 'c++' ? 'cpp' : data.language;
                        setTitle(data.title);
                        setLang(normalizedLanguage);
                        setCode(data.code === '' ? fileExtension[normalizedLanguage]?.defaultCode || '' : data.code);
                    } catch (error) {
                        if (!cancelled) toast.error(error?.response?.data?.message || 'Could not load code file');
                    }
                };
                loadCode();
                return () => { cancelled = true; };
       }, [userId, folderId, fileId]);
  
   const codeRef=useRef();
   const editorOptions={
    fontSize:16,
   }
   const fileExtension={
    cpp:{
        name:'cpp',
        defaultCode: 
        "#include <iostream>\n"
        + "using namespace std;\n\n"
        + "int main() {\n"
        + '\tcout << "Hello World!";\n'
        + "\treturn 0;\n"
        + "}",
    },
    python:{
        name:'py',
        defaultCode: `print("Hello World!")`,
    },
    java:{
        name:'java',
        defaultCode: `public class Main {
            public static void main(String[] args) {
                System.out.println("Hello World!");
            }
}`,
    }, 
    javascript:{
        name:'js',
        defaultCode: `console.log("Hello World!");`,
    }
   }

   const onCodeChange=(newCode)=>{
        codeRef.current=newCode;
    }
   useEffect(()=>{
    onCodeChange(code);
   },[code])
   
   const onLangChange=(e)=>{
        const newLang = e.target.value;
        setLang(newLang);
        if (code === '' || code === fileExtension[lang]?.defaultCode) {
        setCode(fileExtension[newLang]?.defaultCode);
        }
   }
   const onThemeChange=(e)=>{
        const newTheme=e.target.value;
        setTheme(newTheme);
   }
   const importCode=(e)=>{
        const file=e.target.files[0];
      if (!file) return;
        const type=file.type.includes("text");
        if(type){
            const fileReader= new FileReader();
            fileReader.readAsText(file);
            fileReader.onload=function(value){
                const importedCode=value.target.result;
                setCode(importedCode);
                codeRef.current=importedCode;
            }
        }
        else{
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
  }
  const exportCode=()=>{
        const codeVal=codeRef.current?.trim();
        if(!codeVal){
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
        downloadTextFile(codeVal, `code.${fileExtension[lang]?.name || lang}`);
  }
  const saveEditorCode=async()=>{
                try {
                    await updateCardCode(userId,folderId,fileId,codeRef.current || '');
                    toast.success("Code saved successfully", { position:'top-center' });
                } catch (error) {
                    toast.error(error?.response?.data?.message || 'Could not save code');
                }
  }
  const fullScreen=()=>{
        setIsFullScreen(!isFullScreen);
  }
  const styles={
    fullScreen:{
        position:'absolute',
        top:0, left:0, right:0, bottom:0,
        zIndex: 10
    }
  }
  const onRunCode=()=>{
    if(codeRef.current)
        runCode({
            code:codeRef.current,
            language:lang,
        })
    else{toast.error("Code not found",{
        position:'top-center'
    })}
  }
  return (
    <div className='editor' style={isFullScreen ? styles.fullScreen : {}}>
        <div className='editor-header'>
            <div className='left'>
                <b>{title}</b>
                {/* <span className='icons'><FaPencilAlt/> </span> */}
                <button onClick={saveEditorCode}>Save Code</button>
            </div>
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
        </div>    
            <Editor 
                theme={theme}
                height={'100%'}
                language={lang}
                options={editorOptions}
                onChange={onCodeChange}
                value={code}
            />      
        <div className='editor-footer'>
            <button onClick={fullScreen}><BiFullscreen/> {isFullScreen?"Minimise":"FullScreen"}</button>
            <label htmlFor='import'><BiImport/> Import Code</label>
            <input type='file' id='import' style={{display:'none'}} onChange={importCode}/>
            <button onClick={exportCode}><BiExport/> Export </button>
            <button onClick={onRunCode}><VscRunAll/> Run </button>
        </div>
    </div>
  )
}

export default CodeEditor
