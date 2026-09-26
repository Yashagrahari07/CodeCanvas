import React, { useCallback, useEffect, useRef, useState } from 'react';
import './styles.css';
import { BiArrowFromBottom, BiArrowToBottom } from "react-icons/bi";
import CodeEditor from './CodeEditor';
import {formatExecutionResult, makeSubmission} from '../../service/service';
import { downloadTextFile } from '../../service/download';
import { toast } from 'react-hot-toast';

const Playground = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [editorWidth, setEditorWidth] = useState(65); // percentage
  const [isResizing, setIsResizing] = useState(false);

  const[showLoader,setShowLoader]=useState(false);
  const latestRunRef = useRef(0);

  const importInput = (e) => {
    const file = e.target.files[0];
    if (!file) return;
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
    downloadTextFile(outVal, 'output.txt');
  }
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
      const container = document.querySelector('.playground-container');
      if (!container) return;
      const containerWidth = container.offsetWidth;
      const newWidth = (e.clientX / containerWidth) * 100;
      // Limit between 40% and 85% of container width
      if (newWidth >= 40 && newWidth <= 85) {
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
    <div className='playground-container'>
      <div className='content-container' style={{ width: `${editorWidth}%` }}>
        <div className='editor-container'>
          <CodeEditor runCode={runCode}/>
        </div>
      </div>
      <div 
        className='resizer'
        onMouseDown={handleMouseDown}
      ></div>
      <div className='in-out-container' style={{ width: `${100 - editorWidth}%` }}>
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
