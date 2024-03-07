
import { useState } from 'react';
import { Dropdown } from 'flowbite-react';
import axios from 'axios';
import Toaster from '../Toaster';
import { backendBaseUrl } from '../../config';

function PostOptions({ postId }) {

  const [toasts, setToasts] = useState([]);

  function deletePost() {
    const token = localStorage.getItem('token');
    axios.delete(`https://${backendBaseUrl}/api/posts/${postId}/delete/`, {
      headers: {
        'Authorization': `Token ${token}`
      },
      withCredentials: true
    })
    .then(response => {
      if (response.status === 204) {
        window.history.back();
      }
    }).then(() => {
      window.location.reload();
      setToasts(prevToasts => [...prevToasts, { id: `${Date.now()}-${Math.random()}`, timestamp: Date.now() }]);
    })
    .catch(error => {
      console.error('Error:', error);
    });

  }

  return (
    <>
    <div style={{ position: 'fixed', right: 15, top: 15}} >
        {toasts.map(toast => (
            <Toaster key={toast.id} type="delete"/>
        ))}
    </div>
    <Dropdown inline>
      <Dropdown.Item onClick={deletePost}>delete</Dropdown.Item>
    </Dropdown>
    </>
  );

}

export default PostOptions;