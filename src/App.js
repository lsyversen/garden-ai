import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PlantSearchForm from './components/Generate'
import Home from './components/Home'
import Login from './components/Login'
import Navbar from './components/NavBar'
import LearnMore from './components/LearnMore'
import Favorites from './components/Favorites'

const App = () => {
  return (
    <div> 
    <BrowserRouter>
    <Navbar/>
    <main className="sm:p-8 px-4 py-8 w-full bg-[#f9fafe] min-h-[calc(100vh-73px)]">
    <div className="container">
      <Routes>
          <Route path='/' element={<PlantSearchForm/>}/>
          <Route path='/learn' element={<LearnMore/>}/>
          <Route path='/favorites' element={<Favorites/>}/>
          <Route path='/history' element={<Home/>}/>
          <Route path='/login' element={<Login/>}/>
      </Routes>
      </div>
      </main>
    </BrowserRouter>
    </div>
  )
}

export default App