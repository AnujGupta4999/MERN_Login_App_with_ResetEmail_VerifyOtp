import React, { useState } from 'react';
import axios from 'axios';
import convertToBase64 from '../helper/convert';
const CreateUserModal = ({ isOpen, onClose,setUsers }) => {
    const [file, setFile] = useState()



  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    mobile: '',
    profile: ''
  });

  const handleInputChange = async(e) => {
    console.log("target valeu",e.target,e.target)
    const { name, value } = e.target;
    console.log(name,value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));  
    if(name==="profile"){
      const base64= await onUpload(e.target.files[0])
     
      setFormData( (prevData) => ({
        ...prevData,
        'profile':base64
      }));
      
    }
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//         console.log(formData);
//       // Send a POST request to create a new user
//       await axios.post('/api/register', formData);
//       // Close the modal
//       onClose();
//     } catch (error) {
//       console.error('Error creating user:', error);
//     }
//   };


const handleSubmit = async (e) => {
  console.log("file under handle",formData)
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('password', formData.password);
      formDataToSend.append('mobile', formData.mobile);
      formDataToSend.append('profile', formData.profile); // append the file to the form data
  
      // Send a POST request to create a new user
      await axios.post('/api/register', formDataToSend);
      // Close the modal
      const response = await axios.get("/api/user");
      setUsers(response.data);
      onClose();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };


    // /** formik doensn't support file upload so we need to create this handler */
    const onUpload = async (filepath) => {
        const base64 = await convertToBase64(filepath);
  return base64;
      }

  return (
    <div className={`fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white rounded-lg p-8">
        <h2 className="text-xl font-bold mb-4">Create New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block mb-1">Username</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} className="w-full border rounded py-2 px-3" />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border rounded py-2 px-3" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full border rounded py-2 px-3" />
          </div>
          <div className="mb-4">
            <label htmlFor="mobile" className="block mb-1">Mobile</label>
            <input type="text" id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} className="w-full border rounded py-2 px-3" />
          </div>

          
          <div className="mb-4">
            <label htmlFor="profile" className="block mb-1">Profile Image</label>
            <input type="file" id="profile" name="profile" accept="image/*" onChange={handleInputChange} className="w-full border rounded py-2 px-3" />
          </div>

.
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { CreateUserModal}
