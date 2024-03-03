import { Outlet, useMatch } from 'react-router-dom'
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

    const match = useMatch('messages/*');

    return token ? (
    <div className="App">
        <div className="app-bar"> 
        <Dashboard/>
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