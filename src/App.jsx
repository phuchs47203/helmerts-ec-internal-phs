import React, { useState, useEffect, } from 'react'

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home, Login, ManageOrder, ManageShipper, ManageUser, Account, ManageProduct } from './Containers'
import { CreateProduct, CreateShipper, Navbar, UpdateUser } from './Components'

function App() {
  const [permitUser, setPermitUser] = useState(false);
  const isTokenValid = () => {
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) {
      const parsedAccessToken = JSON.parse(storedAccessToken);
      const expirationTime = new Date(parsedAccessToken.expiration_time);
      return Date.now() < expirationTime && (parsedAccessToken.user.role !== 'user');
    }
    return false;
  }
  useEffect(() => {
    const isLoggedIn = isTokenValid();
    if (isLoggedIn) {
      setPermitUser(true);
    }
    else {
      setPermitUser(false);
    }
  }, []);
  return (
    <BrowserRouter>
      <div className='helmerst-app'>
        <div className='helmerst-app-content'>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/signin' element={<Login />} />
            <Route path='/*' element={<PrivateRoutes />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

function PrivateRoutes() {
  return (
    <>
      <Navbar />
      <div className="helmerst-app-content padding_top">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/order" element={<ManageOrder />} />
          <Route path="/user" element={<ManageUser />} />
          <Route path="/shipper" element={<ManageShipper />} />
          <Route path="/account" element={<Account />} />
          <Route path="/product" element={<ManageProduct />} />
          <Route path="/update-user" element={<UpdateUser />} />
          <Route path="/create-product" element={<CreateProduct />} />
          <Route path='/create-shipper' element={<CreateShipper />} />
        </Routes>
      </div>
    </>
  );
}

export default App

// <BrowserRouter>
//   <div className='app-helmerts'>
//     <div className='app-helmerts-login'>
//       <Routes>
//         <Route path='/' element={<Login />} />
//         <Route path='/signin' element={<Login />} />
//       </Routes>
//     </div>
//     <div className='app-helmerts-main'>
//       <Navbar />
//       <div className='app-helmerts-main-component'>
//         <Routes>
//           <Route path='/home' element={<Home />} />
//           <Route path="/order" element={<ManageOrder />} />
//         </Routes>
//       </div>
//     </div>

//   </div>


// </BrowserRouter>
