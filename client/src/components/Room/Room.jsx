import {React, useEffect, useState, useRef, useCallback } from 'react';
import { useParams,useNavigate,useLocation } from 'react-router-dom';
import  initSocket from '../../socket.js';
import Client from './Client.jsx';
import './styles.css';
import ACTIONS from '../../actionTypes.js';
import toast from 'react-hot-toast';
import RealtimeEditor from '../CodeEditor/RealtimeEditor.jsx';
import { BiArrowFromBottom, BiArrowToBottom } from "react-icons/bi";
import { formatExecutionResult, makeSubmission } from '../../service/service.js';

const Room = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const { roomId } = useParams();
    const [clients, setClients] = useState([]);
    const [socket, setSocket] = useState(null);
    const [initialCode, setInitialCode] = useState(null);
    const codeRef=useRef(null);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const latestRunRef = useRef(0);
    const handleRoomCodeChange = useCallback((code) => {
      codeRef.current = code;
    }, []);

    //console.log(roomId);
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
                console.log(err.message,err.description);
                console.log(err.description);
              });

              const joinCurrentRoom = () => {
                connectedSocket.emit(ACTIONS.JOIN, {
                  roomId,
                  username: location.state?.username,
                });
              };
              connectedSocket.on('connect', joinCurrentRoom);

             //listen the event emitted by server
              connectedSocket.on(ACTIONS.JOINED, ({ clients, username, socketId, code }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
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
              
              //disconnecting from server
              connectedSocket.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) =>
                    prev.filter((client) => client.socketId !== socketId)
                );
               });

              // Socket.IO may already be connected before the listener is attached.
              if (connectedSocket.connected) joinCurrentRoom();

          } catch (err) {
              console.error('Socket connection error:', err);
              navigate('/');
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
        toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
        toast.error('Could not copy the Room ID');
        console.error(err);
    }
  };

  const leaveRoom=()=>{
    navigate('/');
  };

  const importInput = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const type = file.type.includes("text");
    if (type) {
      const fileReader = new FileReader();
      fileReader.readAsText(file);
      fileReader.onload = function (value) {
        const importedInput = value.target.result;
        setInput(importedInput);
      }
    } else {
      toast((t) => (
        <span>
          Please choose a text file
          <button style={{borderRadius:'50%',padding:'1vh', border: 'none', marginLeft:'1vh',background:'#5a9a4a',color:'white'}} onClick={() => toast.dismiss(t.id)}>
            OK
          </button>
        </span>
      ));
    }
  };

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
    toast.success("Code saved locally", {
      position: 'top-center',
      duration: 2000
    });
    // You could emit a save event to the server here if needed
  };
  return (
    <div className='room'>
            <div className='mainWrap'>
                <div className='aside'>
                    <div className='asideInner'>
                        <h3>Connected</h3>
                        <div className='clientsList'>
                        {clients?.map((client) => (
                                <Client key={client.socketId} username={client.username} />
                            ))}
                        </div>
                    </div>
                    <div className='rt-buttons'>
                        <button className='btn' onClick={copyRoomId}>
                            Copy ROOM ID
                        </button>
                        <button className='leaveBtn' onClick={leaveRoom}>
                            Leave
                        </button>
                    </div>  
                </div>
                <div className='editorWrap'>
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
                <div className='in-out-container'>
                    <div className='inputt-container'>
                        <div className='inputt-header'>
                            <b>Input :</b>
                            <label htmlFor='input-room' className='input-icon'>
                                <BiArrowToBottom />
                                <span>Import input</span>
                            </label>
                            <input type='file' id='input-room' style={{ display: 'none' }} onChange={importInput} />
                        </div>
                        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter input here..."></textarea>
                    </div>
                    <div className='output-container'>
                        <div className='output-header'>
                            <b>Output :</b>
                            <div className='output-icon' onClick={exportOutput}>
                                <BiArrowFromBottom />
                                <span>Export output</span>
                            </div>
                        </div>
                        <textarea readOnly value={output} placeholder="Output will appear here..."></textarea>
                    </div>
                </div>
            </div>
            {showLoader && <div className='fullpage-loader'>
                <div className='loader'></div>
            </div>}
        </div>
  )
}

export default Room
