import React, { useState } from 'react';
import { Button } from 'flowbite-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Follow( {username, followed} ) {
    const usernameLocal = localStorage.getItem('username');
    const [follows, setFollows] = useState(followed);
    const navigate = useNavigate();

    const editProfile = () => { 
        navigate(`/account/${username}/edit`);
    }

    async function follow() {
        try{
            const response = await axios.post(`http://localhost:8000/api/account/${username}/follow/`, {}, {
                headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
                },
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleResponse = async() => {
        const result = await follow();
        setFollows(result.follows);
        window.location.reload();
    }
    
    return(
        <>
        <p>{follows}</p>
        {username === usernameLocal ? 
        <div className="flex gap-4">
            <Button outline gradientDuoTone="tealToLime" onClick={editProfile}>Edit Profile</Button>
        </div>
        : 
        follows ? 
            <Button gradientDuoTone="tealToLime" onClick={handleResponse} className="hover:text-white w-40" pill>
            Following
            </Button>
            :
            <Button outline gradientDuoTone="tealToLime" onClick={handleResponse} className="hover:text-white w-40" pill>
            Follow
            </Button>
        }
        </>
    )
}

export default Follow;