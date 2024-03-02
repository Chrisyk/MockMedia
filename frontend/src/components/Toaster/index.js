import React, { useEffect, useState } from 'react';
import { Avatar, Toast } from 'flowbite-react'; // replace with your actual import

function Toaster( { notification } ) {
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
                    {notification.type === "like" ?
                        <>
                        <div className="inline-flex shrink-0 items-center justify-center rounded-lg">
                        <Avatar
                            img={notification.profile_picture}
                            size="md"
                            rounded
                        />
                        </div>
                        <div className="ml-5 mr-10 text-sm font-normal">{notification.username} liked your post!</div>
                        </>
                    : 
                    notification.type === "comment" ?
                    <>
                        <div className="inline-flex shrink-0 items-center justify-center rounded-lg">
                        <Avatar
                            img={notification.profile_picture}
                            size="md"
                            rounded
                        />
                        </div>
                        <div className="ml-5 mr-10 text-sm font-normal">{notification.username} commented on your post!</div>
                        </>
                    :
                    notification.type === "message" ?
                    <>
                        <div className="inline-flex shrink-0 items-center justify-center rounded-lg">
                        <Avatar
                            img={notification.profile_picture}
                            size="md"
                            rounded
                        />
                        </div>
                        <div className="ml-5 mr-10 text-sm font-normal">{notification.username}: {notification.message} </div>
                    </>
                    :
                        <>
                        <div className="inline-flex shrink-0 items-center justify-center rounded-lg">
                        <Avatar
                            img={notification.profile_picture}
                            size="md"
                            rounded
                        />
                        </div>
                        <div className="ml-5 mr-10 text-sm font-normal">{notification.username} followed you!</div>
                        </>
                    }
                    
                    <Toast.Toggle />
                </Toast>
            )}
        </div>
    );
}

export default Toaster;