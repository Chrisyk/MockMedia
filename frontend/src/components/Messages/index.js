import React, { useEffect } from 'react';
import { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { TextInput, Button } from 'flowbite-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


function Messages() {
    const localUsername = localStorage.getItem('username');
    const {username} = useParams();
    const token = localStorage.getItem('token');
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (username === localUsername) navigate('/');
        const ws = new WebSocket(`ws://localhost:8000/ws/socket-server/${username}/${token}/`);
        setSocket(ws);
    },[username, token, localUsername, navigate]);

    useEffect(() => {
        if (!socket) return;
    
        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setChat((prevChat) => [...prevChat, data]);
        };
    }, [socket]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (socket) {
            console.log('sending message: ', message);
            socket.send(JSON.stringify({
                type: "message",
                message: message,
                username: localUsername,
            }));
        }
        setMessage("");
    };

    const handleTextChange = (e) => {
        setMessage(e.target.value);
    }

    const handleBackClick = () => {
        window.history.back();
    };

    return (
        <div className='flex flex-col h-screen pb-5 mr-10'>
        <div className="flex pl-5 gap-4 items-start mt-5 border-b">
        <Button gradientDuoTone="tealToLime" size="xs" className="rounded-full hover:bg-gray-100 mb-4" onClick={handleBackClick}><ArrowBackIcon/></Button>
        <h1 className="text-2xl font-bold">{username}</h1>
        </div>
        <div className='overflow-auto mb-auto'>
            {chat.map((messageObject, index) => (
            <p className="pl-5 pt-2" key={index}>{messageObject.username}: {messageObject.message}</p>
            ))}
        </div>
        <div className='w-full pr-5 pl-5'>
            <form onSubmit={sendMessage} className='flex'>
            <TextInput className='flex-grow pr-5' onChange={handleTextChange} value={message} placeholder="Say Something!" />
            <Button color="blue" type="submit">Send</Button>
            </form>
        </div>
        </div>
    );
}

export default Messages;