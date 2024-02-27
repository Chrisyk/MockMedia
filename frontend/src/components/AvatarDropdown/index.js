
import { Avatar, Dropdown } from 'flowbite-react';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import FlagIcon from '@mui/icons-material/Flag';

function AvatarDropdown( { username, avatar } ) {
  const localUsername = localStorage.getItem('username');
  return (
    <Dropdown
      label={<Avatar alt="User settings" img={avatar} rounded />}
      arrowIcon={false}
      inline
    >
      <Dropdown.Item href={`/account/${username}`} icon={PersonIcon}>Profile</Dropdown.Item>
      {localUsername === username ? null :
      <div>
      <Dropdown.Item href={`/messages/${username}`} icon={EmailIcon}>Message</Dropdown.Item>
      <Dropdown.Item href={`/report/${username}`} icon={FlagIcon}>Report</Dropdown.Item>
      </div>
      }
    </Dropdown>
  );
}

export default AvatarDropdown;