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
import Toaster from '../Toaster';
import NotificationsIcon from '@mui/icons-material/Notifications';


const Dashboard = () => {

  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const [messagesUpdate, setMessagesUpdate] = useState(0);
  const [accountData, setAccountData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [notificationData, setNotificationData] = useState([]);
  const [loadingNotificationData, setLoadingNotificationData] = useState(true);
  const [totalNotifications, setTotalNotifications] = useState(0);
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/notifications/${username}/`);
    setSocket(ws);
  },[username, token]);

  useEffect(() => {
      if (!socket) return;
      socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setTotalNotifications(data.totalNotifications);
          if (data && data.message) {
            const newNotification = data.message;
            setNotificationData(oldNotifications => [...oldNotifications, newNotification]);
          }
          setLoadingNotificationData(false);
      };
  }, [socket]);

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

    const handleUpdate = () => {
      setMessagesUpdate(messagesUpdate + 1);
    };

  if (loadingNotificationData === true) {
    return (
      <>
      <div style={{ position: 'fixed', right: 15, top: 15 }}>
        {notificationData ? (
          notificationData.map((notification, index) =>
          <Toaster
            key={index}
            type={notification.type}
            img={notification.profile_picture}
            username={notification.username}
          />
            ))
        : null}
      </div>
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
              <AllMessages chats={accountData ? accountData.chats : []} onClick={handleUpdate} isLoading={isLoading} />
              <Sidebar.Item href="/notifications" className="cursor-pointer" icon={NotificationsIcon}>
                Notifications
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
        </>
    )
  }

  return (
  <>
<div style={{ position: 'fixed', right: 15, top: 15 }}>
  {notificationData ? (
    notificationData.map((notification, index) =>
    <Toaster
      key={index}
      type={notification.type}
      img={notification.profile_picture}
      username={notification.username}
    />
      ))
  : null}
</div>
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
        <AllMessages chats={accountData ? accountData.chats : []} onClick={handleUpdate} isLoading={isLoading} />
        <Sidebar.Item href="/notifications" label={totalNotifications === 0 ? null : totalNotifications} className="cursor-pointer" icon={NotificationsIcon} labelColor="green">
          Notifications
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
  </>
  );
}
export default Dashboard;