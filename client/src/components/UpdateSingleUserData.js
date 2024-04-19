import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import GetBackToHomePage from './GetBackToHomePage';
import Logout from './Logout';
import { useNavigate } from 'react-router-dom';

const UpdateSingleUserData = () => {
  const [editedUser, setEditedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirected, setRedirected] = useState(false); // New state to track redirection
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/getUserById/${userId}`);
        setEditedUser(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();

    return () => {
      // Cleanup function
    };
  }, [userId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSave = async (event) => {

    event.preventDefault();

    try {
      await axios.put(`/api/updateuserone/${userId}`, editedUser);
      if (!redirected) {
        navigate('/home');
        setRedirected(true); // Set redirected to true to prevent further redirects
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <GetBackToHomePage />
      <h1 className="text-3xl font-bold mb-8 text-center">Edit User Details</h1>
      <form className="max-w-lg mx-auto bg-blue-200 p-6 rounded-md shadow-2xl relative">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username:
            <input
              type="text"
              name="username"
              value={editedUser.username}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email:
            <input
              type="text"
              name="email"
              value={editedUser.email}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Phone Number:
            <input
              type="text"
              name="mobile"
              value={editedUser.mobile}
              onChange={handleInputChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save
          </button>
        </div>
      </form>
      <Logout />
    </div>
  );
};

export default UpdateSingleUserData;





