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
import backendBaseUrl from '../../config';


const Dashboard = () => {

  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');
  const [messagesUpdate, setMessagesUpdate] = useState(0);
  const [chatData, setChatData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [popNotificationData, setPopNotificationData] = useState([]);
  const [loadingNotificationData, setLoadingNotificationData] = useState(true);
  const [notificationData, setNotificationData] = useState([]);

  useEffect(() => {
    const ws = new WebSocket(`ws://${backendBaseUrl}/ws/notifications/${username}/`);
    setSocket(ws);
  },[username, token]);

  useEffect(() => {
      if (!socket) return;
      socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          setNotificationData(data);
          console.log(data);
          if (data && data.message) {
            const newNotification = data.message;
            setPopNotificationData(oldNotifications => [...oldNotifications, newNotification]);
            let audio = new Audio('https://mockmedia.s3.amazonaws.com/notification.mp3');
            audio.play();
          }
          setLoadingNotificationData(false);
      };
  }, [socket]);

  // Get the all chats
  useEffect(() => {
    setIsLoading(true);
    if (username) {
    Axios.get(`http://${backendBaseUrl}/api/chats`, {
        headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
        },
        withCredentials: true
    })
    .then(response => {
        setIsLoading(false);
        setChatData(response.data);
        
    }).catch(error => {
        console.error('Error:', error);
    });
    }
    }, [username, messagesUpdate]);

    const handleUpdate = () => {
      setMessagesUpdate(messagesUpdate + 1);
    };

  if (loadingNotificationData === true && isLoading === true) {
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
              <AllMessages
               chats={chatData ? chatData : []} 
               onClick={handleUpdate}
               totalChatNotifications={notificationData.totalMessages} // All chats notifications
               chatNotifications={notificationData.chatNotifications ? notificationData.chatNotifications : []} // Individual chat notifications
               />
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
    )
  }

  return (
  <>
<div style={{ position: 'fixed', right: 15, top: 15 }}>
  {popNotificationData ? (
    popNotificationData.map((notification, index) =>
    <Toaster
      key={index}
      notification={notification}
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
        <AllMessages
          chats={chatData ? chatData : []} 
          onClick={handleUpdate}
          isLoading={isLoading}
          totalChatNotifications={notificationData.totalMessages} 
          chatNotifications={notificationData.chatNotifications ? notificationData.chatNotifications : []}/>
        <Sidebar.Item 
        href="/notifications" 
        label={notificationData.totalNotifications === 0 ? null : notificationData.totalNotifications} 
        className="cursor-pointer" 
        icon={NotificationsIcon} 
        labelColor="green">
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