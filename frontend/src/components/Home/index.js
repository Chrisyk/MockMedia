import React, { useEffect, useState } from 'react';
import PostTemplate from '../PostTemplate';
import Axios from 'axios';
import { backendBaseUrl } from '../../config';
import './index.scss';
import Loading from '../Loading';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [Likes, setLiked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
            Axios.get(`http://${backendBaseUrl}/api/posts/`, {
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
            setIsLoading(false);
        }).catch(error => {
            console.error('Error:', error);
        });
    }, []);

    if (isLoading) {
        return (
            <div className="home relative h-full min-h-screen w-full pl-20 pr-20 bg-gray-100">
            <h1 className="home-text text-4xl font-bold mt-2">Home</h1>
            <div className="border mb-2 mt-2"></div>
            <div className="loading">
            <Loading />
            <Loading />
            </div> 
            </div>
        )
    }

    return (
        <div className="home relative h-full min-h-screen w-full p-scale bg-gray-100">
        <h1 className="home-text text-4xl font-bold mt-2">Home</h1>
        <div className="border mb-2 mt-2"></div>
        <PostTemplate posts={posts} Likes={Likes}/>
        </div>
    );
};

export default Home;