import React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Sidebar } from 'flowbite-react';
import Logo from '../../assets/images/logo-c.png';
import { useEffect, useState } from 'react';
import Post from '../Post'
import AllMessages from '../AllMessages';
import Axios from 'axios';


const Dashboard = () => {

  const [username, setUsername] = useState('');
  const [messagesUpdate, setMessagesUpdate] = useState(0);
  const [accountData, setAccountData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const username = localStorage.getItem('username');
      setUsername(username);
  }, [username]);

  // Get the account data
  useEffect(() => {
    setIsLoading(true);
    if (username) {
    Axios.get(`http://localhost:8000/api/account/${username}`, {
        headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
        },
        withCredentials: true
    })
    .then(response => {
        setIsLoading(false);
        setAccountData(response.data);
    }).catch(error => {
        console.error('Error:', error);
    });
    }
    }, [username, messagesUpdate]);

    const handleChatUpdate = () => {
      setMessagesUpdate(messagesUpdate + 1);
    };


  return (
  <Sidebar aria-label="Default sidebar example">
    <Sidebar.Logo href="/" img={Logo} imgAlt="Logo">
      MockMedia
    </Sidebar.Logo>
    <Sidebar.Items>
      <Sidebar.ItemGroup>
        <Sidebar.Item href="/" icon={HomeIcon}>
          Home
        </Sidebar.Item>
        <Sidebar.Item href={`/account/${username}`} icon={PersonIcon}>
          Account
        </Sidebar.Item>
        <AllMessages chats={accountData ? accountData.chats : []} onClick={handleChatUpdate} isLoading={isLoading} />
        <Post />
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
        <Sidebar.Item href="/logout" icon={ExitToAppIcon} labelColor="dark">
          Log Out
        </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar.Items>
  </Sidebar>
  );
}
export default Dashboard;