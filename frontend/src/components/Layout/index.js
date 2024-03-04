import { Outlet, useMatch } from 'react-router-dom'
import Dashboard from '../Dashboard'
import Trending from '../Trending'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';
import MenuIcon from '@mui/icons-material/Menu';
import backendBaseUrl from '../../config';
import Toaster from '../Toaster';
import './index.scss'

const Layout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [isSidebarVisible, setSidebarVisible] = useState(true);

    const [socket, setSocket] = useState(null);
    const [popNotificationData, setPopNotificationData] = useState([]);
    const [loadingNotificationData, setLoadingNotificationData] = useState(true);
    const [notificationData, setNotificationData] = useState([]);
    const username = localStorage.getItem('username');

    useEffect(() => {
        if (!token) {
          navigate('/login');
        }
      }, [token, navigate]);
      
    useEffect(() => {
      setSidebarVisible(false);
    }, []);

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

    const match = useMatch('messages/*');

    return token ? (
      <div className="App">
      <div style={{ position: 'fixed', right: 15, top: 15, zIndex: 100 }}>
        {popNotificationData ? (
          popNotificationData.map((notification, index) =>
          <Toaster
            key={index}
            notification={notification}/>
          )): null}
      </div>
      <Button onClick={() => setSidebarVisible(!isSidebarVisible)} gradientDuoTone="tealToLime" size="xs" className="ultility-button rounded-full w-14 h-14 right-5 bottom-5 fixed z-10">
        <MenuIcon/>
      </Button>
      <div className={`app-bar ${isSidebarVisible || 'hidden lg:block'} fixed z-10`}> 
      <Dashboard loadingNotificationData={loadingNotificationData} notificationData={notificationData}/>
      </div>
      <div className="page">
          <Outlet />
      </div>
      {!match && 
      <div className="trending">
      <Trending />
      </div>
      }
      </div>
    ) : null;
    
}

export default Layout