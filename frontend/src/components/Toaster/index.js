import React, { useEffect, useState } from 'react';
import { Avatar, Toast } from 'flowbite-react'; // replace with your actual import
import { HiCheck } from 'react-icons/hi';

function Toaster( {type, username, img} ) {
    const [showToast, setShowToast] = useState(false);

    const handleMoveItem = () => {

        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
        }, 5000);
    };

    useEffect(() => {
        handleMoveItem();
        
    }, []);

    return (
        <div>
            {showToast && (
                <Toast>
                    {type === "delete" ?
                        <>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                        <HiCheck className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">Post deleted!</div>
                        </>
                    : type === "like" ?
                        <>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                        <Avatar
                            img={img}
                            size="xs"
                            rounded
                        />
                        </div>
                        <div className="ml-3 text-sm font-normal">{username} Liked your post!</div>
                        </>
                    : 
                        <>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                            <img href={img} alt="pfp" className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">{username} your post!</div>
                        </>
                    }
                    
                    <Toast.Toggle />
                </Toast>
            )}
        </div>
    );
}

export default Toaster;