import React from 'react'
import { useNavigate } from 'react-router-dom';


function GetBackToHomePage() {
    const navigate = useNavigate()

    // logout handler function
  function backToHome(){
    navigate('/home')
  }
  return (

   
 
 <button onClick={backToHome} className=' bg-green-500 hover:bg-green-50C0 text-white font-bold py-2 px-4 rounded fixed top-3 left-4' to="/">Home Page</button>
 
  )
}

export default GetBackToHomePage