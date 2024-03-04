import React from 'react';
import { Avatar, TextInput, Textarea, Button} from 'flowbite-react';
import { useParams } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Banner from '../Banner';
import backendBaseUrl from '../../config';


import './index.scss';

function EditAccount() {
    const {username} = useParams();
    const bannerInput = useRef();
    const avatarInput = useRef();
    const [newProfile, setNewProfile] = useState(null);
    const [newProfileUrl, setNewProfileUrl] = useState(null);
    const [newUsername, setNewUsername] = useState(username);
    const [newDescription, setNewDescription] = useState('');
    const [newBanner, setNewBanner] = useState(null);
    const [newBannerUrl, setNewBannerUrl] = useState(null);
    const [changed, setChanged] = useState([]);
    const [accountData, setAccountData] = useState(null);
    const navigate = useNavigate();

    // Get the account data
    useEffect(() => {
        Axios.get(`http://${backendBaseUrl}/api/account/${username}`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
            withCredentials: true
        })
        .then(response => {
            setAccountData(response.data);
        }).catch(error => {
            console.error('Error:', error);
        });
    }, [username]);

    async function editAccount() {
        try{
            const formData = new FormData();
            if (changed.includes('profile')){
                formData.append('newProfile', newProfile);
            }
            if (changed.includes('banner')){
                formData.append('newBanner', newBanner);
            }
            if (changed.includes('username')) {
                formData.append('newUsername', newUsername);
            }
            formData.append('newDescription', newDescription);
            const response = await Axios.post(`http://${backendBaseUrl}/api/account/${username}/change/`, formData,{
                headers: {
                    'Authorization': `Token ${localStorage.getItem('token')}`
                    },
                    withCredentials: true
            });

            if (response.status === 200) {
                console.log('Account edited');
                if (changed.includes('username')) {
                    localStorage.setItem('username', newUsername);
                }
                navigate(`/account/${newUsername}`);
                window.location.reload();
            };
        } catch (error) {
            console.error(error.response.data);
        }

        }

    useEffect(() => {
        if (accountData) {
            setNewProfileUrl(accountData.profile_picture);
            setNewBannerUrl(accountData.banner);
            setNewDescription(accountData.description);
            setNewUsername(username);
        }
    }, [accountData, username]);
    
    if (!accountData) {
        return (
            <div className="relative h-full min-h-screen w-full pl-10 bg-gray-100">
            <div role="status" className="max-w max-h mr-20 mt-5 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
            <div className="flex items-center justify-center h-56 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                </svg>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <div className="flex items-center mt-4">
               <svg className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                </svg>
                <div>
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                    <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
            </div>
            
            <span className="sr-only">Loading...</span>
            </div>
            </div>
        );
    }
    
    const handleAvatarChange = (event) => {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            if (file.type.startsWith('image/')) {
                const fileUrl = URL.createObjectURL(file);
                setNewProfileUrl(fileUrl);
                setNewProfile(file);
                console.log('newProfile changed:', newProfileUrl);
                setChanged([...changed, 'profile']);
            } else {
                console.log('The selected file is not an image');
            }
        }

    };

    const handleBannerChange = (event) => {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            if (file.type.startsWith('image/')) {
                const fileUrl = URL.createObjectURL(file);
                setNewBannerUrl(fileUrl);
                setNewBanner(file);
                console.log('newBanner changed:', newBannerUrl);
                setChanged([...changed, 'banner']);
            } else {
                console.log('The selected file is not an image');
            }
        }
    };

    const handleDescriptionChange = (event) => {
        setChanged([...changed, 'description']);
        setNewDescription(event.target.value);
    }
    
    const handleUserChange = (event) => {
        setChanged([...changed, 'username']);
        setNewUsername(event.target.value);
    };

    const handleAvatarClick = () => {
        avatarInput.current.click();
    };
    
    const handleBannerClick = () => {
        bannerInput.current.click();
    };


    return (
    <div className="relative h-full overflow-hidden">
        <div className="avatar cursor-pointer">
            <input type="file" ref={bannerInput} style={{ display: 'none' }} onChange={handleBannerChange} />
            <Banner onClick={handleBannerClick} url={newBannerUrl}/>
        </div>
        <div className="mt-36 bg-gray-100 h-full flex flex-col justify-items-start gap-3 p-10">
            <div>
            <input type="file" ref={avatarInput} style={{ display: 'none' }} onChange={handleAvatarChange} />
            <Avatar
                img={newProfileUrl}
                className="avatar w-32 h-0 object-scale-down rounded-full border-1 pb-12 pr-12 border-gray-300 cursor-pointer"
                size="lg"
                rounded
                bordered
                onClick={handleAvatarClick}
            />

            </div>
            <h2 className="text-2xl font-bold text-gray-800">Edit Account</h2>
            <div className="max-w-md">
                <TextInput id="username3" placeholder="Username" addon="@" value={newUsername} onChange={handleUserChange} />
            </div>
            <div className="max-w-lg">
            <Textarea id="text" placeholder="Description" value={newDescription} rows={4} onChange={handleDescriptionChange}/>
            </div>
            <div className="flex gap-4">
                <Button size="sm" outline gradientDuoTone="tealToLime" className="text-white rounded" onClick={editAccount}>Submit</Button>
            </div>
        </div>
    </div>
);
}

export default EditAccount;