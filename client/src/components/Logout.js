import React from 'react'
import { useNavigate } from 'react-router-dom';


function Logout() {
    const navigate = useNavigate()

  function userLogout(){
    localStorage.removeItem('token');
    navigate('/')
  }
  return (

 <button onClick={userLogout} className=' bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded fixed top-3 right-2' to="/">Logout</button>

    
  )
}

export default Logout