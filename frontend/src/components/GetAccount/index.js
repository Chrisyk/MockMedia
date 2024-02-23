// useAccount.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const GetAccount = (username) => {
    const [accountData, setAccountData] = useState(null);

    const getAccount = useCallback(async () => {
        const token = localStorage.getItem('token');
        axios.get(`http://localhost:8000/api/account/${username}`, {
            headers: {
                'Authorization': `Token ${token}`
            },
            withCredentials: true
        })
        .then(response => {
            setAccountData(response.data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [username]);

    useEffect(() => {
        getAccount();
    }, [getAccount]);

    return accountData;
};

export default GetAccount;