import {React, useEffect, useState, useRef, } from 'react';
import { useParams,useNavigate,useLocation, useAsyncError } from 'react-router-dom';
import  initSocket from '../../socket.js';
import Client from './Client.jsx';
import './styles.css';
import ACTIONS from '../../actionTypes.js';
import toast from 'react-hot-toast';
import RealtimeEditor from '../CodeEditor/RealtimeEditor.jsx';

const Room = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const { roomId } = useParams();
    const [clients, setClients] = useState([]);
    const codeRef=useRef(null);

    //console.log(roomId);
    useEffect(() => {
      const init = async () => {
          try {
              socketRef.current = await initSocket();
              socketRef.current.on("connect_error", (err) => {
                console.log(err.message,err.description);
                console.log(err.description);
              });

              //emit join room event
              socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
             });

             //listen the event emitted by server
             socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
                if (username !== location.state?.username) {
                    toast.success(`${username} joined the room.`);
                }
                setClients(clients);
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: codeRef.current,
                    socketId,
                });           
              });
              
              //disconnecting from server
              socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room.`);
                setClients((prev) =>
                    prev.filter((client) => client.socketId !== socketId)
                );
               });

          } catch (err) {
              console.error('Socket connection error:', err);
              navigate('/');
          }
      };

      init();
      return () => {
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        socketRef.current.disconnect();
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
  }
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
                        socketRef={socketRef}
                        roomId={roomId}
                        OnChangeCode={(code) => {
                            codeRef.current = code;
                        }}/>
                </div>
            </div>
        </div>
  )
}

export default Room
