import React from 'react';
import { useState, useEffect } from 'react';
import Axios from 'axios';
import AvatarDropdown from '../AvatarDropdown';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Skelleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function NotificationPage () {
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const localUser = localStorage.getItem('username');

    useEffect(() => {
        Axios.get('http://localhost:8000/api/notifications/', {
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

    return (
        <div className="relative h-full min-h-screen w-full bg-gray-100">
        <div className="w-11/12 rounded-xl bg-white p-5 ml-10 mt-5 shadow-md">
            <div className="flex justify-between gap-4 items-center">
            <div className="flex gap-4 items-center">
                <h2 className="text-2xl font-bold pb-5">Notifications</h2>
            </div>
            </div>
            {!isLoading ?
                <div>
                    {notifications.length < 1 ?
                    <div className="flex flex-col gap-4">
                        <p className="mt-2 pb-2 pt-2">You have no notifications</p>
                    </div>
                    :
                    notifications.map((notification, index) => (
                        <div key={index} className="pb-2">
                        <a key={index} 
                             className="flex border-b pt-3 pb-5 pl-2 items-center justify-between rounded-xl hover:bg-gray-100"
                             href={`/${localUser}/status/${notification.post}`}
                        >
                                <div className="flex items-center">
                                <FavoriteIcon className="mr-5" style={{ fill: 'red' }}/>
                                <div className="pr-5">
                                <AvatarDropdown 
                                username={notification.sender.username} 
                                avatar={notification.profile_picture} 
                                />
                                </div>
                                <h2 className="font-bold pr-2">{notification.sender.username}</h2>
                                {notification.type === 'like' ? <p> liked your post</p> : null}
                                </div>
                                <p className='pr-5'>{notification.date} </p>
                        </a>
                        </div>
                    ))}
                </div>
                :
                <>
                <div class="flex items-center border-b pt-3 pb-5 mt-4 w-max">
                <svg class="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                    </svg>
                    <div>
                        <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-80 mb-2"></div>
                        <div class="w-96 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                </div>
                <div class="flex items-center mt-4 w-max">
                <svg class="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                    </svg>
                    <div>
                        <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-80 mb-2"></div>
                        <div class="w-96 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                </div>
                
                </>
                
            }
        </div>
        </div>
    )
}

export default NotificationPage;