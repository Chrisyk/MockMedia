import React from 'react';
import { Avatar, TextInput, Textarea, Button} from 'flowbite-react';
import { useParams } from 'react-router-dom';
import { useState, useRef } from 'react';
import { useEffect } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Banner from '../Banner';
import { backendBaseUrl } from '../../config';
import Loading from '../Loading';

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
            const response = await Axios.post(`https://${backendBaseUrl}/api/account/${username}/change/`, formData,{
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
            <div className="loading pl-10 pr-10">
            <Loading />
            <Loading />
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