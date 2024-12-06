import React, { useRef, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { BiFullscreen, BiImport,BiExport } from "react-icons/bi";
import { VscRunAll } from "react-icons/vsc";
import {Editor} from '@monaco-editor/react';
import { updateCardCode,getCardDetails,getData} from '../../api/api';
import { toast } from 'react-hot-toast';

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
   //console.log(folder,file);
  
   const getDefaultCode=async()=>{
        const { data } = await getCardDetails(userId, folderId, fileId);
        console.log(data);
        setTitle(data.title)
        setLang(data.language);
        if (data.code === '') {
        setCode(fileExtension[data.language]?.defaultCode);
        } else {
        setCode(data.code);
        }
    }

   useEffect(() => {
        getDefaultCode();
        codeRef.current=code;
   }, [fileId]);
  
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
        //console.log(newCode);
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
        console.log(file)
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
        //create a blob/instant file in memory
        const codeBlob=new Blob([codeVal],{type:"text/plain"});

        //create downloadable link with blob data
        const url=URL.createObjectURL(codeBlob);

        //create clickable link to download
        const link=document.createElement("a");
        link.href=url;
        link.download=`code.${fileExtension[lang].name}`;
        link.click();
  }
  const saveEditorCode=async()=>{
        const newcode=codeRef.current;
        console.log(userId,folderId,fileId,newcode);
        const res=await updateCardCode(userId,folderId,fileId,newcode)
        console.log(res);
        toast.success("Code saved successfully",{
            position:'top-center'
        })
        // const newdata=await getData(userId);
        // console.log(newdata.data);
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
