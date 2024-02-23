import axios from "axios";
import { Button } from "flowbite-react";
import { useState } from "react";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Toaster from '../Toaster';

function HeartButton({ postId, Liked, likesCount }) {

    const [isLiked, setIsLiked] = useState(Liked);
    const [totalLikes, setTotalLikes] = useState(likesCount);
    const [toasts, setToasts] = useState([]);

    async function HeartPost(postId) {
        try{
            const response = await axios.post(`http://localhost:8000/api/posts/${postId}/like/`, {}, {
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
        const result = await HeartPost(postId);
        console.log(result);
        setIsLiked(result.added);
        setTotalLikes(result.total_likes);
        if (result.added) {
            setToasts(prevToasts => [...prevToasts, { id: `${Date.now()}-${Math.random()}`, timestamp: Date.now() }]);
        }
    };

    return (
        <>
        <div style={{ zIndex: 4, position: 'fixed', right: 15, top: 15 }} >
            {toasts.map(toast => (
                <Toaster key={toast.id} />
            ))}
        </div>
        <Button size="xs" outline className="hover:bg-gray-200 rounded-full hover:text-gray-800 transition duration-200" onClick={handleLike}>
            <p className="pr-2">{totalLikes}</p>
            {isLiked ? <FavoriteIcon style={{ fill: 'red' }}/> : <FavoriteBorderIcon/>}
        </Button>
        </>
    );
}

export default HeartButton;