import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/Home';
import LoginPage from './components/Login';
import RegisterPage from './components/Register';
import Layout from './components/Layout';
import LogoutAndRedirect from './components/Logout';
import AccountPage from './components/AccountPage';
import AccountEditPage from './components/EditAccount';
import PostScreen from './components/PostScreen';
import Messages from './components/Messages';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/account/:username" element={<AccountPage />} />
          <Route path="/account/:username/edit" element={<AccountEditPage />} />
          <Route path="/messages/:username" element={<Messages/>} />
          <Route path="/:username/status/:id" element={<PostScreen />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/logout" element={<LogoutAndRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;