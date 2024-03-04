import React from 'react';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import AvatarDropdown from '../AvatarDropdown';
import { Button } from 'flowbite-react';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PersonIcon from '@mui/icons-material/Person';
import { backendBaseUrl } from '../../config';
import './index.scss'

function NotificationPage () {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const localUser = localStorage.getItem('username');

    useEffect(() => {
        Axios.get(`http://${backendBaseUrl}/api/notifications/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
            withCredentials: true
        })
        .then(response => {
            setNotifications(response.data);
            setIsLoading(false);
        }).catch(error => {
            console.error('Error:', error);
        });
    }, []);

    function clearNotifications() {
        Axios.delete(`http://${backendBaseUrl}/api/notifications/delete`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
            withCredentials: true
        })
        .then(() => {
            setNotifications([]);
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    return (
        <div className="notifications rounded-xl bg-white p-5 ml-10 mr-10 mt-5 shadow-md">
            <div className="notification flex justify-between gap-4 items-center pb-5">
            <h2 className="text-2xl font-bold">Notifications</h2>
            <Button size="xs" outline gradientDuoTone="tealToLime" onClick={clearNotifications}>clear all</Button>
            </div>
            {!isLoading ?
                <div>
                    {notifications.length < 1 ?
                    <div className="flex flex-col gap-4">
                        <p className="mt-2 pb-2 pt-2">You have no notifications</p>
                    </div>
                    :
                    notifications.map((notification, index) => (
                        <div key={index}>
                        {notification.type === 'like' || notification.type === 'comment'?
                        <a key={index} 
                             className="notification flex border-b pt-4 mt-3 pb-5 items-center justify-between rounded-xl hover:bg-gray-100"
                             href={`/${localUser}/status/${notification.post}`} >
                                <div className="flex">
                                {notification.type === 'like' ? 
                                <FavoriteIcon className="mt-2" style={{ fill: 'red' }}/> 
                                : 
                                <ChatBubbleOutlineIcon className="mt-2" style={{ fill: 'gray' }}/>
                                }
                                <div className="ml-2">
                                <AvatarDropdown 
                                username={notification.sender.username} 
                                avatar={notification.profile_picture} 
                                />
                                <div className="flex items-center mt-2">
                                <h2 className="font-bold pr-2">{notification.sender.username}</h2>
                                {notification.type === 'like' ? <p> liked your post</p> 
                                :
                                <p> commented on your post</p>
                                }
                                </div>
                                </div>
                                </div>
                        </a>
                        :
                        <a key={index} 
                             className="notification flex border-b pt-4 mt-3 pb-5 items-center justify-between rounded-xl hover:bg-gray-100"
                             href={`/account/${notification.sender.username}`} >
                                <div className="flex">
                                <PersonIcon className="mt-2" style={{ fill: '#489cdb' }}/>
                                <div className="ml-2">
                                <AvatarDropdown 
                                username={notification.sender.username} 
                                avatar={notification.profile_picture} 
                                />
                                <div className="flex items-center mt-2">
                                <h2 className="font-bold pr-2">{notification.sender.username}</h2>
                                <p>followed you</p>
                                </div>
                                </div>
                                </div>
                        </a>  
                            }
                        </div>
                    ))}
                </div>
                :
                <>
                <div className="flex items-center border-b pt-3 pb-5 mt-4 w-max">
                <svg className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                    </svg>
                    <div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-80 mb-2"></div>
                        <div className="w-96 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                </div>
                <div className="flex items-center mt-4 w-max">
                <svg className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                    </svg>
                    <div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-80 mb-2"></div>
                        <div className="w-96 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                </div>
                
                </>
                
            }
        </div>
    )
}

export default NotificationPage;