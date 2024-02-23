import React, { useEffect, useState } from 'react';
import PostTemplate from '../PostTemplate';
import Axios from 'axios';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [Likes, setLiked] = useState(false);
    
    useEffect(() => {
            Axios.get('http://localhost:8000/api/posts/', {
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
    }, []);


    return (
        <div className="relative h-full min-h-screen w-full pl-10 bg-gray-100">
        <h1 className="text-4xl font-bold mt-2">Home</h1>
            <PostTemplate posts={posts} Likes={Likes}/>
        </div>
    );
};

export default Home;