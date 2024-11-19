import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Add from './components/Add'
import SPost from './components/SPost'

const App = () => {
  const [user,setUser] = useState(null);
  return (
    <div className='h-full w-full '>
      <Routes>
        <Route path='/' element={<Home user={user} setUser={setUser}/>}/>
        <Route path='/login' element={<Login user={user} setUser={setUser}/>}/>
        <Route path='/register' element={<Register user={user} setUser={setUser}/>}/>
        <Route path='/add' element={<Add user={user} setUser={setUser}/>}/>
        <Route path='/post/:slug' element={<SPost user = {user}/>}/>
      </Routes>
    </div>
  )
}

export default App