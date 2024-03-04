
import { Button, Modal, Textarea, FileInput } from 'flowbite-react';
import { useState } from 'react';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import axios from 'axios';
import { backendBaseUrl } from '../../config';

function Post( { postId, numComments}) {
    const [openModal, setOpenModal] = useState(false);
    const [text, setText] = useState('');
    const [files, setFiles] = useState([]);

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    const handleSubmit = async () => {
        console.log('submitting post...');
        const formData = new FormData();
        formData.append('text', text);
        for (let i = 0; i < files.length; i++) {
            formData.append('files[]', files[i]);
            console.log('New file: ',files[i]);
        }

        try {
          const response = await axios.post(`http://${backendBaseUrl}/api/newpost/${postId}/`, formData, {
              headers: {
                  'Authorization': `Token ${localStorage.getItem('token')}`,
              },
              withCredentials: true,
          });
      
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
        }

        setOpenModal(false);
        window.location.reload();
    };


  return (
    <>
      <Button size="xs" className='bg-white text-gray-700 rounded-full hover:bg-gray-200 transition duration-200' onClick={() => setOpenModal(true)}>
        <p className="pr-2">{numComments}</p>
        <ChatBubbleOutlineIcon/>
    </Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Reply</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
          <Textarea id="text" placeholder="Say something!" rows={4} onChange={handleTextChange}/>
          <FileInput id="files" multiple accept="image/*,video/mp4" onChange={handleFileChange}/>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button gradientDuoTone="tealToLime" className="text-gray-600" onClick={handleSubmit}>Post</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Post;