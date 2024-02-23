import { Outlet } from 'react-router-dom'
import Dashboard from '../Dashboard'
import Trending from '../Trending'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './index.scss'
const Layout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
          navigate('/login');
        }
      }, [token, navigate]);

    return token ? (
    <div className="App">
        <div className="app-bar"> 
        <Dashboard/>
        </div>
        <div className="page">
            <Outlet />
        </div>
        <div className="trending">
          <Trending/>
        </div>
      </div>
    ) : null;
    
}

export default Layout