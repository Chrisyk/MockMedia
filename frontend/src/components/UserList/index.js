import { Modal, Card } from 'flowbite-react';
import AvatarDropdown from '../AvatarDropdown';
import React, { useState } from 'react';
import Follow from '../Follow';

function UserList( {users, text, onClick, isLoading, title} ) {
  const [openModal, setOpenModal] = useState(false);
  const id = localStorage.getItem('id');
  const username = localStorage.getItem('username');
  const Localuser = users.find(user => user.username === username);

  const handleResponse = async() => {
    setOpenModal(true);
    if (onClick) {
      onClick();
    }
  }
  return (
    <>
    <p className="cursor-pointer hover:underline" onClick={handleResponse}>{text}</p>
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header> 
        <p className="text-xl font-bold leading-none text-gray-900 dark:text-white">{title}</p>
      </Modal.Header>
      <Card className="max-w">
        <div className="flow-root">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {Localuser && (
            <li className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="shrink-0">
                  <AvatarDropdown
                    avatar={Localuser.profile_picture}
                    username={Localuser.username}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{Localuser.username}</p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">{Localuser.description}</p>
                </div>
                <Follow username={Localuser.username} followed={Localuser.followers.includes(Number(id))} />
              </div>
            </li>
          )}
          {isLoading ? 
          
          <>
          <div className="flex items-center border-b pt-3 pb-5 mt-4 w-max">
          <svg className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
              </svg>
              <div>
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-80 mb-2"></div>
                  <div className="w-96 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
          </div>
          <div className="flex items-center mt-4 w-max">
          <svg className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z"/>
              </svg>
              <div>
                  <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-80 mb-2"></div>
                  <div className="w-96 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
              </div>
          </div>
          
          </>

          :
          users.map((user, index) => (
            user.id === Number(id) ? 
            null :
            <li key={index} className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="shrink-0">
                  <AvatarDropdown
                    avatar={user.profile_picture}
                    username={user.username}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{user.username}</p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">{user.description}</p>
                </div>
                <Follow username={user.username} followed={user.followers.includes(Number(id))} />
              </div>
            </li>
          ))
          } 
          </ul>
        </div>
      </Card>
    </Modal>
    </>
  );
}

export default UserList;
