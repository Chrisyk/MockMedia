import React, { useEffect, useState } from 'react';
import { Toast } from 'flowbite-react'; // replace with your actual import
import FavoriteIcon from '@mui/icons-material/Favorite';
function Toaster() {
    const [showToast, setShowToast] = useState(false);

    const handleMoveItem = () => {

        setShowToast(true);

        setTimeout(() => {
            setShowToast(false);
        }, 3000);
    };

    useEffect(() => {
        handleMoveItem();
        
    }, []);

    return (
        <div className="transition ease-in-out">
            {showToast && (
                <Toast className="animate-fade-in-out">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                        <FavoriteIcon className="h-5 w-5" />
                    </div>
                    <div className="ml-3 text-sm font-normal">Liked Post!</div>
                    <Toast.Toggle />
                </Toast>
            )}
        </div>
    );
}

export default Toaster;