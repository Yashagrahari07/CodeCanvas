import React, { useCallback, useEffect, useState } from 'react';
import './styles.css';
import { BiArrowFromBottom, BiArrowToBottom } from "react-icons/bi";
import CodeEditor from './CodeEditor';
import {makeSubmission} from '../../service/service';
import { toast } from 'react-hot-toast';

const Playground = () => {
  const user=JSON.parse(localStorage.getItem('profile'));
  const userId=user?.result?._id;

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const[showLoader,setShowLoader]=useState(false);

  const importInput = (e) => {
    const file = e.target.files[0];
    const type = file.type.includes("text");
    if (type) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = function (value) {
        const importedCode = value.target.result;
        setInput(importedCode);
      }
    } else {
      toast((t) => (
        <span>
          Please choose a program file
          <button style={{borderRadius:'50%',padding:'1vh', border: 'none', marginLeft:'1vh',background:'#5a9a4a',color:'white'}} onClick={() => toast.dismiss(t.id)}>
            OK
          </button>
        </span>
      ));
    }
  }

  const exportOutput = () => {
    const outVal = output.trim();
    if (!outVal) {
      toast((t) => (
        <span>
          No Output available.
          <button style={{borderRadius:'50%',padding:'1vh', border: 'none', marginLeft:'1vh',background:'#5a9a4a',color:'white'}} onClick={() => toast.dismiss(t.id)}>
            OK
          </button>
        </span>
      ));
      return;
    }
    const outBlob = new Blob([outVal], { type: "text/plain" });
    const url = URL.createObjectURL(outBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `output.txt`;
    link.click();
  }
  const callback = useCallback(({ apiStatus, data, message }) => {
    if (apiStatus === 'loading') {
        setShowLoader(true);
    } else if (apiStatus === 'error') {
      setShowLoader(false);
      setOutput("Something went wrong: " + message);
    } else {
      setShowLoader(false);
      if (data.status.id === 3) {
        // Execution successful
        setOutput(atob(data.stdout));
      } else if (data.status.id === 6) {
        // Compilation error
        setOutput("Compilation Error:\n" + atob(data.compile_output));
      } else if (data.status.id === 5) {
        // Runtime error
        setOutput("Runtime Error:\n" + atob(data.stderr));
      } else {
        // Any other status
        setOutput("Error: " + data.status.description);
      }
    }
  }, []);

  const runCode = useCallback(({ code, language }) => {
    makeSubmission({ code, language, stdin: input, callback });
  }, [input, callback]);
  //recreates this function whenever there's change in input

  return (
    <div className='playground-container'>
      <div className='content-container'>
        <div className='editor-container'>
          <CodeEditor runCode={runCode}/>
        </div>
      </div>
        <div className='in-out-container'>
        <div className='inputt-container'>
          <div className='inputt-header'>
            <b>Input :</b>
            <label htmlFor='input' className='input-icon'>
              <BiArrowToBottom />
              <span>Import input</span>
            </label>
            <input type='file' id='input' style={{ display: 'none' }} onChange={importInput} />
          </div>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}></textarea>
        </div>
        <div className='output-container'>
          <div className='output-header'>
            <b>Output :</b>
            <div className='output-icon' onClick={exportOutput}>
              <BiArrowFromBottom />
              <span>Export output</span>
            </div>
          </div>
          <textarea readOnly value={output} onChange={(e) => setOutput(e.target.value)}></textarea>
        </div>
      </div>
      {showLoader && <div className='fullpage-loader'>
            <div className='loader'></div>
        </div>}
    </div>
  )
}

export default Playground;
