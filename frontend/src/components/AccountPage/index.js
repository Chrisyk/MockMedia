import React, { useState, useEffect } from 'react';
import { Avatar} from 'flowbite-react';
import { useParams } from 'react-router-dom';
import Banner from '../Banner';
import PostTemplate from '../PostTemplate';
import Axios from 'axios';
import Follow from '../Follow';
import UserList from '../UserList';

function Account() {
    const {username} = useParams();
    const [accountData, setAccountData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [Liked, setLiked] = useState(false);
    const [followUpdate, setFollowUpdate] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Gets the posts
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

    // Get the account data
    useEffect(() => {
        setIsLoading(true);
        Axios.get(`http://localhost:8000/api/account/${username}`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
            withCredentials: true
        })
        .then(response => {
            setIsLoading(false);
            setAccountData(response.data);
        }).catch(error => {
            console.error('Error:', error);
        });
    }, [username, followUpdate]);

    if (!accountData) {
        return (
            <div className="relative h-full min-h-screen w-full pl-10 bg-gray-100">
            <div role="status" class="max-w max-h mr-20 mt-5 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
            <div class="flex items-center justify-center h-56 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z"/>
                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z"/>
                </svg>
            </div>
            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
            <div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
            <div class="flex items-center mt-4">
               <svg class="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
                </svg>
                <div>
                    <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                    <div class="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                </div>
            </div>
            
            <span class="sr-only">Loading...</span>
            </div>
            </div>
        )
    }

    const handleFollowUpdate = () => {
        setFollowUpdate(followUpdate + 1);
    };


    return (
    <div className="relative w-full h-full overflow-hidden">
        <Banner url={accountData.banner}/>
        <div className="mt-36 bg-gray-100 h-full flex flex-col justify-items-start gap-3 p-10">
            <Avatar img={accountData.profile_picture} className="w-32 h-0 object-cover rounded-full border-1 pb-12 pr-12 border-gray-300" size="lg" rounded bordered/>
            <div className="flex justify-between gap-4 items-center">
            <h2 className="text-2xl font-bold text-gray-800">{accountData.username}</h2>
            <Follow username={username} onClick={handleFollowUpdate} followed={accountData.is_following}/>

            </div>
            <p className="text-lg text-gray-600">{accountData.description}</p>
            <div className="flex gap-4">
                <p className="text-lg font-semibold text-gray-800">{accountData.followed.length} </p> 
                <UserList users={accountData.followed} onClick={handleFollowUpdate} isLoading={isLoading} text="Followers" title="Followers"/>
                <p className="text-lg font-semibold text-gray-800">{accountData.following.length} </p>
                <UserList users={accountData.following} onClick={handleFollowUpdate} isLoading={isLoading} text="Following" title="Following"/>
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