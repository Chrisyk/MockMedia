import { AvatarGroup, Modal, Sidebar } from 'flowbite-react';
import { useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import AvatarDropdown from '../AvatarDropdown';

function AllMessages( { chats, onClick, isLoading, totalChatNotifications, chatNotifications } ) {
    const [openModal, setOpenModal] = useState(false);
    const handleResponse = async() => {
        setOpenModal(true);
        if (onClick) {
            onClick();
        }
    }

    return (
    <>
        <Sidebar.Item className="cursor-pointer" onClick={handleResponse} icon={EmailIcon} 
        label={totalChatNotifications > 0 ? totalChatNotifications : null} labelColor="green">
          Mail
        </Sidebar.Item>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>
            <div className="flex justify-between">
                <EmailIcon className="mt-1"/>
                <p className="ml-2">Messages</p>
            </div>
        </Modal.Header>
        <Modal.Body>
            {isLoading ? <p>Loading...</p> :
            chats.map((chat, index) => (
                <div className="flex mb-5" key={index}>
                <div className="flex w-20">
                <AvatarGroup>
                    {chat.participants.map((participant, index2) => (
                        <div key={index2}>
                            <AvatarDropdown
                                avatar={participant.profile_picture}
                                username={participant.username} />
                        </div>

                    ))}
                </AvatarGroup>
                </div>
                
                    {chat.participants.map((participant, index2) => (
                        participant.username === localStorage.getItem('username') ? null :
                        <div key={chat.id} className="flex justify-between w-full ml-5">
                        <div className="flex mt-1 hover:underline cursor-pointer">
                            <a className="text-lg font-bold mr-2" href={`/messages/${participant.username}`}>{participant.username}</a>
                        </div>

                        <p className='mt-2'>Notifications: {
                            chatNotifications.find(chatNotifications => chatNotifications.chat === chat.id)?.count || 0
                        }</p>
                        </div>
                    ))}
                </div>
            ))
            }
            
        </Modal.Body>
        </Modal>
            </>
  );
}

export default AllMessages;