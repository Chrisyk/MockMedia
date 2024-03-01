import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from 'flowbite-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PostTemplate from '../PostTemplate';


function PostScreen() {
    const {id} = useParams();
    const [postData, setPostData] = useState();
    const [comments, setComments] = useState([]);
    const [Likes, setLiked] = useState(false);
    const [mainLikes, setMainLikes] = useState(false)
    const [postLoaded, setPostLoaded] = useState(false);

    const getPost = useCallback(async () => {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:8000/api/posts/${id}`, {
            headers: {
                'Authorization': `Token ${token}`
            },
            withCredentials: true
        })
        .then(response => {
            setPostData(response.data);
            const newCommentLikes = {};
            newCommentLikes[response.data.id] = {
                isLiked: response.data.liked,
                totalLikes: response.data.likes.length
            };
            setMainLikes(newCommentLikes);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [id]);

    const handleBackClick = () => {
        window.history.back();
    };

    useEffect(() => {
        getPost().then(() => {
            setPostLoaded(true);
        });
    }, [getPost]);
        
    useEffect(() => {
        if (postLoaded && postData && postData.comments) {
            const token = localStorage.getItem('token');
            Promise.all(postData.comments.map(commentId => 
                axios.get(`http://localhost:8000/api/posts/${commentId}`, {
                    headers: {
                        'Authorization': `Token ${token}`
                    },
                    withCredentials: true
                })
            )).then(responses => {
                const fetchedComments = responses.map(response => response.data);
                setComments(fetchedComments);

                const newCommentLikes = {};
                for (let comment of fetchedComments) {
                    newCommentLikes[comment.id] = {
                        isLiked: comment.liked,
                        totalLikes: comment.likes.length
                    };
                }
                setLiked(newCommentLikes);
            }).catch(error => {
                console.error('Error:', error);
            });
            }
        }, [postLoaded, postData]);

        if (!postData) {
            return (
            <div className="relative h-full min-h-screen w-full pl-10 pt-20 bg-gray-100">
            <div role="status" class="max-w mr-20 mt-5 border border-gray-200 rounded shadow animate-pulse md:p-6 dark:border-gray-700">
            <div class="flex items-center justify-center h-96 mb-4 bg-gray-300 rounded dark:bg-gray-700">
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

    return (
        <div className="flex flex-col pl-10 h-full bg-gray-100">
            <div className="flex gap-4 items-start mt-5">
            <Button gradientDuoTone="tealToLime" size="xs" className="rounded-full hover:bg-gray-100 mb-4" onClick={handleBackClick}><ArrowBackIcon/></Button>
            </div>
            <PostTemplate posts={[postData]} Likes={mainLikes}/>
        <div>
            {postData.comments.length > 0 ? <h3 className="text-xl font-semibold text-gray-800 mb-4">Comments</h3> : <h3 className="text-center mr-36">No Comments</h3>}
            <PostTemplate posts={comments} Likes={Likes}/>
            </div> 
        </div>
    );
}

export default PostScreen;