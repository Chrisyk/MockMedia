import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button } from 'flowbite-react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PostTemplate from '../PostTemplate';
import backendBaseUrl from '../../config';
import Loading from '../Loading';
import './index.scss';


function PostScreen() {
    const {id} = useParams();
    const [postData, setPostData] = useState();
    const [comments, setComments] = useState([]);
    const [Likes, setLiked] = useState(false);
    const [mainLikes, setMainLikes] = useState(false)
    const [postLoaded, setPostLoaded] = useState(false);

    const getPost = useCallback(async () => {
        const token = localStorage.getItem('token');
        axios.get(`http://${backendBaseUrl}/api/posts/${id}`, {
            headers: {
                'Authorization': `Token ${token}`
            },
            withCredentials: true
        })
        .then(response => {
            setPostData(response.data);
            console.log(response.data);
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
                axios.get(`http://${backendBaseUrl}/api/posts/${commentId}`, {
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
            <div className="pl-5 pr-5 flex flex-col w-full h-full bg-gray-100">
            <div className="flex gap-4 items-start mt-5">
            <Button gradientDuoTone="tealToLime" size="xs" className="rounded-full hover:bg-gray-100 mb-4" onClick={handleBackClick}><ArrowBackIcon/></Button>
            </div>
            <Loading />
            <Loading />
            </div>
            )
        }

    return (
        <div className="posts flex flex-col pl-10 pr-10 h-full bg-gray-100">
            <div className="flex gap-4 items-start mt-5">
            <Button gradientDuoTone="tealToLime" size="xs" className="back-button rounded-full hover:bg-gray-100 mb-4" onClick={handleBackClick}><ArrowBackIcon/></Button>
            </div>
            <PostTemplate posts={[postData]} Likes={mainLikes}/>
        <div>
            {postData.comments.length > 0 ? <h3 className="comments-text text-xl font-semibold text-gray-800 mb-4">Comments</h3> : <h3 className="text-center ml-10 mr-10">No Comments</h3>}
            <PostTemplate posts={comments} Likes={Likes}/>
            </div> 
        </div>
    );
}

export default PostScreen;