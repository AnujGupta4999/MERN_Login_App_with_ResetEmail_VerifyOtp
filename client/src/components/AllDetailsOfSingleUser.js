import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Logout from "./Logout";
import GetBackToHomePage from "./GetBackToHomePage";

const Alldetailsofsingleuser = () => {
  const [userDetails, setUserDetails] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/getUserById/${userId}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();

    return () => {
      // Cleanup function
    };
  }, [userId]);

  if (!userDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container w-3/5 mx-auto px-4 py-8 relative">
      <GetBackToHomePage />
      <h1 className="text-3xl font-bold mb-4 text-center">User Details</h1>
      <div className="bg-blue-200 p-6 rounded-md shadow-2xl relative">
        <img
          src={userDetails.profile}
          alt="User Profile"
          className="w-32 h-32 object-cover rounded-full absolute top-10 right-10"
        />
        <div>
          <p className="text-lg font-semibold">Username:</p>
          <p>{userDetails.username}</p>
        </div>
        <div className="mt-4">
          <p className="text-lg font-semibold">Email:</p>
          <p>{userDetails.email}</p>
        </div>
        <div className="mt-4">
          <p className="text-lg font-semibold">Phone Number:</p>
          <p>{userDetails.mobile}</p>
        </div>
        <div className="mt-4">
          <p className="text-lg font-semibold">Created At</p>
          <p>{userDetails.createdAt}</p>
        </div>
      </div>
      <Logout />
    </div>
  );
};

export default Alldetailsofsingleuser;

