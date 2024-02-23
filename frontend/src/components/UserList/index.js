import { Card } from 'flowbite-react';

function UserList() {
  return (
    <Card className="max-w">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">All Users</h5>
        <button className="text-sm font-medium text-lime-600 hover:underline dark:text-lime-500">
          View all
        </button>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
         
        </ul>
      </div>
    </Card>
  );
}

export default UserList;
