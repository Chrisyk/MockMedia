import { Modal, Card } from 'flowbite-react';
import AvatarDropdown from '../AvatarDropdown';
import React, { useState } from 'react';
import Follow from '../Follow';

function UserList( {users, text, title} ) {
  const [openModal, setOpenModal] = useState(false);
  const id = localStorage.getItem('id');
  const username = localStorage.getItem('username');
  const Localuser = users.find(user => user.username === username);
  return (
    <>
    <p className="cursor-pointer hover:underline" onClick={() => setOpenModal(true)}>{text}</p>
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
          {users.map((user, index) => (
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
          ))}
          </ul>
        </div>
      </Card>
    </Modal>
    </>
  );
}

export default UserList;
