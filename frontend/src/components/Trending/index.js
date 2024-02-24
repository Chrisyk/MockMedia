import { TextInput, Card, Avatar} from 'flowbite-react';
import SearchIcon from '@mui/icons-material/Search';
import UserList from '../UserList';
import Axios from 'axios';
import { useEffect, useState } from 'react';


function Trending() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        Axios.get('http://localhost:8000/api/accounts/', {
        headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
        },
        withCredentials: true
    })
    .then(response => {
        setUsers(response.data);
    }).catch(error => {
        console.error('Error:', error);
    });
    }, []);

    return (
        <div className="w-full">
        <TextInput id="search" type="search" rightIcon={SearchIcon} placeholder="Search" />
        <div className="w-full mt-5 ">
        <Card className="max-w-sm mb-5">
        <div className="mb-4 flex items-center justify-between">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Users</h5>
            <UserList users={users} text="Show More" title="All Users"/>
        </div>
        <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            <Avatar.Group>
            {users.slice(0, 10).map((user, index) => (
                <Avatar key={index} img={user.profile_picture} rounded stacked />
            ))}
                {users.length > 10 ?
                    <Avatar.Counter total={users.length-10}/>
                    :
                    null
                }
            </Avatar.Group>
            </ul>
        </div>
        </Card>
        <Card
            className="max-w-sm"
            imgAlt="Meaningful alt text for an image that is not purely decorative"
            imgSrc="https://source.unsplash.com/random/600x300"
            >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Portfolio
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
                This is an ad. Go visit my website at <a href="http://www.christopher-ko.com" className="text-blue-500">christopher-ko.com</a> for more information.
            </p>
        </Card>
        </div>
        
        </div>
        
    )
}

export default Trending