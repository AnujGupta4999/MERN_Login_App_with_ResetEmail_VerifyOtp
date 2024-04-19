import React, { useState ,useEffect } from "react";
import axios from "axios"; 
import { CreateUserModal } from "./CreateUserModal";
import { useNavigate } from "react-router-dom";
import Logout from "./Logout";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 

  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get("/api/user");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };


  const handleEdit = async (userId) => {

    navigate(`/updatesingleuserdata/${userId}`);

  };

  const handleSave = async (userId) => {
    try {

      await axios.put(`/api/updateuserone/${userId}`, editedUser);
      fetchUserDetails();
      setEditingUserId(null);
      setEditedUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/deleteUser/${userId}`);

      setUsers(users.filter((user) => user._id !== userId));
      fetchUserDetails();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleCancel = () => {
    setEditingUserId(null);
    setEditedUser(null);
  };

  const toggleCreateUserModal = () => {
    setIsCreateUserModalOpen((prev) => !prev);
  };


  const handleViewDetails = (userId) => {
    
    navigate(`/alldetailsofsingleuser/${userId}`); // Navigate to the user details page
  
};

const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );




  return (
    <div>
      <div className="mt-16 ml-10 mr-10 mb-10">
        <table className="min-w-full bg-gray-500 shadow-md rounded-lg overflow-hidden border ">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-3 px-4 uppercase font-semibold text-sm mx-24">
                Username
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm mx-24 ">
                Email
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm mx-24">
                Phone No
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm mx-24">
                Profile
              </th>
              <th className="py-3 px-4 uppercase font-semibold text-sm mx-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((user) => {
            //   console.log(user);
              return (
                <tr key={user._id}>
                  <td className="py-4 px-6 border-b bg-white  text-center">
                    {editingUserId === user._id ? (
                      <input
                        type="text"
                        name="username"
                        value={editedUser?.username || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      />
                    ) : (
                      user.username
                    )}
                  </td>
                  <td className="py-4 px-6 border-b bg-white text-center">
                    {editingUserId === user._id ? (
                      <input
                        type="text"
                        name="email"
                        value={editedUser?.email || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      />
                    ) : (
                      user.email
                    )}
                  </td> 

                
                  <td className="py-4 px-6 border-b bg-white text-center">
                    {editingUserId === user._id ? (
                      <input
                        type="text"
                        name="mobile"
                        value={editedUser?.mobile || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                      />
                    ) : (
                      user.mobile
                    )}
                  </td>
                  <td className="py-4 px-6 border-b bg-white text-center">
                    <img
                      src={user.profile}
                      alt="avatar img"
                      className="w-24 h-24 object-cover rounded-full"
                    />
                  </td>
                  <td className="py-4 px-6 border-b bg-white">
                    {editingUserId === user._id ? (
                      <div className="flex justify-around">
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => handleSave(user._id)}
                        >
                          Save
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                          onClick={handleCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-around">
                        <button
                          className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded"
                          onClick={() => handleViewDetails(user._id)}
                        >
                          View
                        </button>
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-2 rounded"
                          onClick={() => handleEdit(user._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4  rounded"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div>
          <button
            onClick={toggleCreateUserModal}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded fixed top-3 right-28 "
          >
            Create
          </button>
          <CreateUserModal
          setUsers = {setUsers}
            isOpen={isCreateUserModalOpen}
            onClose={toggleCreateUserModal}
          />
        </div>

        <Logout />

        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 px-4 py-2 rounded border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

export default Home;
