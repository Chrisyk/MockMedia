import { TextInput, Card, Avatar} from 'flowbite-react';
import SearchIcon from '@mui/icons-material/Search';
import UserList from '../UserList';
import Axios from 'axios';
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';


function Trending() {
    const [users, setUsers] = useState([]);
    const [followUpdate, setFollowUpdate] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingWeather, setIsLoadingWeather] = useState(true);
    const [searchResult, setSearchResult] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [weather, setWeather] = useState([]);

    useEffect(() => {
        setIsLoading(true);
        Axios.get(`http://${backendBaseUrl}/api/accounts/`, {
        headers: {
            'Authorization': `Token ${localStorage.getItem('token')}`
        },
        withCredentials: true
    })
    .then(response => {
        setIsLoading(false);
        setUsers(response.data);
    }).catch(error => {
        console.error('Error:', error);
    });
    }, [followUpdate]);

    const handleFollowUpdate = () => {
        setFollowUpdate(followUpdate + 1);
    };

    const handleSearchUpdate = async (event) => {
        const response = await Axios.get(`http://${backendBaseUrl}/api/search/`, {
            headers: {
                'Authorization': `Token ${localStorage.getItem('token')}`
            },
            params: {
                q: event.target.value
            },
            withCredentials: true
        });
        console.log(response.data);
        setSearchResult(response.data);
    };

    useEffect(() => {
        const cachedWeather = localStorage.getItem('weather');
        if (cachedWeather) {
            setWeather(JSON.parse(cachedWeather));
            setIsLoadingWeather(false);
        } else {
            navigator.geolocation.getCurrentPosition(function(position) {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
        
                console.log(latitude);
                fetch(`http://${backendBaseUrl}/api/get_weather/?latitude=${latitude}&longitude=${longitude}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Token ${localStorage.getItem('token')}`
                    },
                }).then(response => response.json())
                .then(data => {
                    console.log(data);
                    localStorage.setItem('weather', JSON.stringify(data));
                    setWeather(data);
                    setIsLoadingWeather(false);
                }).catch(error => {
                    console.error('Error:', error);
                });
            });
        }
    }, []);

    const debouncedSearch = debounce(handleSearchUpdate, 300);

    let blurTimeout = null;

    const handleBlur = () => {
        blurTimeout = setTimeout(() => {
            setIsFocused(false);
        }, 150);
    };
    
    const handleFocus = () => {
        clearTimeout(blurTimeout);
        setIsFocused(true);
    };
    return (
    <div className="width-full">
        <div>
            <TextInput id="search" type="search" rightIcon={SearchIcon} placeholder="Search" onChange={debouncedSearch} onBlur={handleBlur} onFocus={handleFocus}/>
            {isFocused ?
                <div style={{ position: 'absolute', width: '80%', zIndex: 1 }}>
                {searchResult.map(result => (
                    <a href={`/account/${result.username}`} key={result.id}>
                    <div className="w-full py-1 bg-white shadow-md hover:bg-gray-200">
                        <div className="flex items-center ml-2 pb-2 pt-2">
                            <Avatar img={result.profile_picture} className='mr-5' size="sm" rounded></Avatar>
                            <p className="text-md">{result.username}</p>
                            
                        </div>
                    </div>
                    </a>
                ))}
            </div>
            : null
        }
        </div>
        <div className="w-full mt-5 ">
        <Card className="max-w mb-5">
        <div className="mb-4 flex items-center justify-between">
            <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Users</h5>
            <UserList users={users} onClick={handleFollowUpdate} isLoading={isLoading} text="Show More" title="All Users"/>
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
        {isLoadingWeather ? 
        null
        :
            <div className="bg-gradient-to-t from-blue-300 to-blue-500 flex flex-col items-center justify-center p-4 mb-5 max-w text-white rounded">
            <h2 className="text-2xl mb-2" style={{ fontFamily: 'Roboto' }}>{weather.name}</h2>
            <img
                src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
                alt={weather.weather[0].description}
            />
            <h1 className="text-4xl font-bold mt-2">
                {Math.round(weather.main.temp - 273.15)}°C
            </h1>
            <h4 className="text-md">Feels like {Math.round(weather.main.feels_like - 273.15)}°C</h4>
            <p className="text-sm mt-2">Humidity: {weather.main.humidity}%</p>
            <p className="text-sm">Wind: {weather.wind.speed} m/s</p>
            </div>
        }
        <Card
            className="max-w mb-5"
            imgAlt="Meaningful alt text for an image that is not purely decorative"
            imgSrc="https://mockmedia.s3.amazonaws.com/cardImage.jpg"
            href="https://christopher-ko.com/"
            >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Portfolio
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
                My name is Christopher and I'm a web developer. I'm passionate about creating beautiful and functional websites.
            </p>
        </Card>
        </div>
        
    </div>
        
    )
}

export default Trending