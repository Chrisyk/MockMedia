import React from 'react';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Sidebar } from 'flowbite-react';
import Logo from '../../assets/images/logo-c.png';
import { useEffect, useState } from 'react';
import Post from '../Post'


const Dashboard = () => {

  const [username, setUsername] = useState('');

    useEffect(() => {
        const username = localStorage.getItem('username');
        setUsername(username);
    }, [username]);

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
        <Sidebar.Item href={`/messages`} icon={EmailIcon} labelColor="dark">
          Mail
        </Sidebar.Item>
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