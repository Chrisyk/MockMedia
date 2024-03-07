import axios from "axios";
import { Button } from "flowbite-react";
import { useState } from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { backendBaseUrl } from '../../config';

function HeartButton({ postId, Liked, likesCount }) {
    const [isLiked, setIsLiked] = useState(Liked);
    const [totalLikes, setTotalLikes] = useState(likesCount);

    async function HeartPost(postId) {
        try{
            const response = await axios.post(`https://${backendBaseUrl}/api/posts/${postId}/like/`, {}, {
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

    const handleLike = async () => {
        setIsLiked(!isLiked);
        setTotalLikes(isLiked ? totalLikes - 1 : totalLikes + 1);
        const result = await HeartPost(postId);
        console.log(result);
        setIsLiked(result.added);
        setTotalLikes(result.total_likes);
    };

    return (
        <>
        <Button size="xs" outline className="hover:bg-gray-200 rounded-full hover:text-gray-800 transition duration-200" onClick={handleLike}>
            <p className="pr-2">{totalLikes}</p>
            {isLiked ? <FavoriteIcon style={{ fill: 'red' }}/> : <FavoriteBorderIcon/>}
        </Button>
        </>
    );
}

export default HeartButton;