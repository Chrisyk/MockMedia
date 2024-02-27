import { AvatarGroup, Modal, Sidebar } from 'flowbite-react';
import { useState } from 'react';
import EmailIcon from '@mui/icons-material/Email';
import AvatarDropdown from '../AvatarDropdown';

function AllMessages( { chats, isLoading, onClick }) {
    const [openModal, setOpenModal] = useState(false);

    const handleResponse = async() => {
        setOpenModal(true);
        if (onClick) {
            onClick();
        }
    }
    return (
    <>
        <Sidebar.Item className="cursor-pointer" onClick={handleResponse} icon={EmailIcon} labelColor="dark">
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
            {chats.map((chat, index) => (
                <div className="flex mb-5" key={index}>
                <AvatarGroup>
                    {chat.participants.map((participant, index2) => (
                        <div key={index2}>
                            <AvatarDropdown
                                avatar={participant.profile_picture}
                                username={participant.username} />
                        </div>

                    ))}
                </AvatarGroup>
                <div className="flex ml-5 mt-1 hover:underline cursor-pointer">
                    {chat.participants.map((participant, index2) => (
                        participant.username === localStorage.getItem('username') ? null :
                        <a className="text-lg font-bold mr-2" href={`/messages/${participant.username}`} key={index2}>{participant.username}</a>
                    ))}
                </div>
                </div>
            ))
            }
            
        </Modal.Body>
        </Modal>
            </>
  );
}

export default AllMessages;