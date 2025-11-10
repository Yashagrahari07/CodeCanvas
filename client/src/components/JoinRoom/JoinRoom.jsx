import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import * as api from '../../api/api';
import toast from 'react-hot-toast';
import './styles.css';

const JoinRoom = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const user = JSON.parse(localStorage.getItem('profile'));

    // Pre-fill username if user is logged in
    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('profile'));
        if (profile?.result?.name) {
            setUsername(profile.result.name);
        }
    }, []);

    const createRoom = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.createRoom();
            console.log(data);
            setRoomId(data.roomId);
            toast.success('Created a new room');
        } catch (err) {
            toast.error('Could not create a new room');
        }
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('ROOM ID & username are required');
            return;
        }
        toast.success("Welcome to the Room", {
            position: 'top-center'
        });
        navigate(`/room/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter')
            joinRoom();
    };

    return (
        <>
            <Navbar />
            <div className='join-room-container'>
                <div className='join-room-wrapper'>
                    <h2 className='magic'>Join/Create Room</h2>
                    <h4 className="mainLabel">Paste invitation Room Id</h4>
                    <div className="inputGroup">
                        <input
                            type="text"
                            className="inputBox"
                            placeholder="ROOM ID"
                            onChange={(e) => { setRoomId(e.target.value) }}
                            value={roomId}
                            onKeyUp={handleInputEnter}
                        />
                        <input
                            type="text"
                            className="inputBox"
                            placeholder="USERNAME"
                            onChange={(e) => { setUsername(e.target.value) }}
                            value={username}
                            onKeyUp={handleInputEnter}
                            required
                        />
                        <button className="button" onClick={joinRoom}>
                            Join
                        </button>
                        <span className="createInfo">
                            Don't have an invite ?  &nbsp;
                            <a onClick={createRoom}
                                href=""
                                className="createNewBtn"
                            >
                                Create own Room
                            </a>
                        </span>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default JoinRoom;

