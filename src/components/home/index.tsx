import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import ItemList from './item-list';
import useAuthStore from '../../hooks/useAuthStore';
import { useAuth } from '../../context/auth-context';
import { SignOut } from '@phosphor-icons/react';
import Swal from 'sweetalert2';

const Home = () => {
  const [currentDate, setCurrentDate] = useState<string>('');
  const username = useAuthStore((state) => state.username);
  const { logout } = useAuth();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, log out!',
    });

    if (result.isConfirmed) {
      logout();
    }
  };

  useEffect(() => {
    const currentDateFormatted = format(new Date(), 'PPpp');
    setCurrentDate(currentDateFormatted);
  }, []);

  return (
    <div className="p-2 md:p-10">
      <div className="flex flex-col md:flex-row gap-2 p-2 items-start justify-between md:items-center md:h-24 mb-4 bg-gray-200 md:p-10 rounded-lg border border-gray-300">
        <h1 className="text-xl md:text-2xl font-bold">Welcome, {username}</h1>
        <div className="flex flex-row items-center justify-between gap-2 md:gap-6">
          <span className="text-sm  md:text-lg">{currentDate}</span>
          <button
            onClick={handleLogout} // Call handleLogout when clicked
            className="p-1 md:p-2 text-base bg-red-500 text-white rounded-md shadow-lg hover:bg-red-600 transition duration-200 flex items-center justify-center"
            aria-label="Logout"
          >
            <SignOut size={24} className="text-white" />
          </button>
        </div>
      </div>

      <div className="bg-light-gray border border-gray-300 p-1 md:p-4 rounded-lg">
        <ItemList />
      </div>
    </div>
  );
};

export default Home;
