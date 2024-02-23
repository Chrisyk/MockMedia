import { TextInput } from 'flowbite-react';
import SearchIcon from '@mui/icons-material/Search';
import UserList from '../UserList';

function Trending() {
    return (
        <div className="w-full">
        <TextInput id="search" type="search" rightIcon={SearchIcon} placeholder="Search" />
        <div className="w-full mt-5 ">
        <UserList />
        </div>
        </div>
        
    )
}

export default Trending