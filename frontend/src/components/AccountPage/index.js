import React, { useState, useEffect } from 'react';
import { Avatar } from 'flowbite-react';
import { useParams } from 'react-router-dom';
import GetAccount from '../GetAccount';
import Banner from '../Banner';
import PostTemplate from '../PostTemplate';
import Axios from 'axios';
import Follow from '../Follow';

function Account() {
    const {username} = useParams();
    const accountData = GetAccount(username);
    const [posts, setPosts] = useState([]);
    const [Liked, setLiked] = useState(false);
    
    useEffect(() => {
        Axios.get(`http://localhost:8000/api/posts/user/${username}/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
            withCredentials: true
        })
        .then(response => {
            setPosts(response.data);
            const newPostLikes = {};
            for (let post of response.data) {
                newPostLikes[post.id] = {
                    isLiked: post.liked,
                    totalLikes: post.likes.length
                };
            }
            setLiked(newPostLikes);
        }).catch(error => {
            console.error('Error:', error);
        });
    }, [username]);

    if (!accountData) {
        return <div>Loading...</div>;
    }


    return (
    <div className="relative w-full h-full overflow-hidden">
        <Banner url={accountData.banner}/>
        <div className="mt-36 bg-gray-100 h-full flex flex-col justify-items-start gap-3 p-10">
            <Avatar img={accountData.profile_picture} className="w-32 h-0 object-cover rounded-full border-1 pb-12 pr-12 border-gray-300" size="lg" rounded bordered/>
            <div className="flex justify-between gap-4 items-center">
            <h2 className="text-2xl font-bold text-gray-800">{accountData.username}</h2>
            <Follow username={username} followed={accountData.is_following}/>

            </div>
            <p className="text-lg text-gray-600">{accountData.description}</p>
            <div className="flex gap-4">
                <p className="text-lg font-semibold text-gray-800">{accountData.followed.length} Followers</p>
                <p className="text-lg font-semibold text-gray-800">{accountData.following.length} Following</p>
            </div>
            
            <div className="mt-5 border-t pt-6">
            <h2 className="text-2xl font-bold mt-2">Posts</h2>
                <PostTemplate posts={posts} Likes={Liked} />
            </div>
        </div>
    </div>
);
}

export default Account;