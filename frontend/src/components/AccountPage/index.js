import React, { useState, useEffect } from 'react';
import { Avatar} from 'flowbite-react';
import { useParams } from 'react-router-dom';
import Banner from '../Banner';
import PostTemplate from '../PostTemplate';
import Axios from 'axios';
import Follow from '../Follow';
import UserList from '../UserList';
import ReactModal from 'react-modal';
import { backendBaseUrl } from '../../config';
import Loading from '../Loading';
import './index.scss';

function Account() {
    if (process.env.NODE_ENV !== 'test') ReactModal.setAppElement('#root');
    const {username} = useParams();
    const [accountData, setAccountData] = useState(null);
    const [posts, setPosts] = useState([]);
    const [Liked, setLiked] = useState(false);
    const [followUpdate, setFollowUpdate] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Gets the posts
    useEffect(() => {
        Axios.get(`https://${backendBaseUrl}/api/posts/user/${username}/`, {
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
        Axios.get(`https://${backendBaseUrl}/api/account/${username}`, {
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
            <div className="loading pl-10 pr-10">
            <Loading />
            <Loading />
            </div>
        )
    }

    const handleFollowUpdate = () => {
        setFollowUpdate(followUpdate + 1);
    };


    return (
    <div className="relative w-full h-full overflow-hidden">
        <Banner url={accountData.banner}/>
        <div className="posts mt-28 bg-gray-100 h-full flex flex-col justify-items-start gap-3 pt-20">
            <div className="post-area p-scale">
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
            </div>
            <div className="post-area border-t p-scale">
            <h2 className="post-text text-2xl font-bold pt-5">Posts</h2>
                <PostTemplate posts={posts} Likes={Liked} />
            </div>
        </div>
    </div>
);
}

export default Account;