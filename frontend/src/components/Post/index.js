import { Button, Modal, Textarea, FileInput } from 'flowbite-react';
import { useState } from 'react';
import CreateIcon from '@mui/icons-material/Create';
import axios from 'axios';

function Post() {
    const [openModal, setOpenModal] = useState(false);
    const [text, setText] = useState('');
    const [files, setFiles] = useState([]);

    const handleTextChange = (event) => {
        setText(event.target.value.substring(0, 10));
    };

    const handleFileChange = (event) => {
      if (event.target.files.length > 6) {
        alert('You can only upload a maximum of 6 files');
        event.target.value = '';  // Clear the selected files
      } else {
        setFiles(event.target.files);
      }
    };

    const handleSubmit = async () => {
        console.log('submitting post...');
        setOpenModal(false);
        const formData = new FormData();
        formData.append('text', text);
        for (let i = 0; i < files.length; i++) {
            formData.append('files[]', files[i]);
            console.log('New file: ',files[i]);
        }

        try {
          const response = await axios.post('http://localhost:8000/api/newpost/', formData, {
              headers: {
                  'Authorization': `Token ${localStorage.getItem('token')}`,
              },
              withCredentials: true,
          });
      
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
        window.location.reload();
    };

  return (
    <>
      <Button gradientDuoTone="tealToLime" size="xs" className="w-full h-full justify-start py-1.5 text-gray-600" onClick={() => setOpenModal(true)}>
        <CreateIcon/>
        <p className="ml-2 text-base">Post</p>
        </Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>New Post</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
          <Textarea id="text" placeholder="Say something!" required rows={4} onChange={handleTextChange}/>
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