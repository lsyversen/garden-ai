import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PlantSearchForm from './components/Generate'
import Home from './components/Home'
import Login from './components/Login'
import Navbar from './components/NavBar'

const App = () => {
  return (
    <div> 
    <BrowserRouter>
    <Navbar/>
    <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
    <div className="container">
      <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path="/search" element={<PlantSearchForm/>}/>
      </Routes>
      </div>
      </main>
    </BrowserRouter>
    </div>
  )
}

export default App