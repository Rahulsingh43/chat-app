
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import './App.css'
import Home from './Components/Home'
import Register from './Components/Register'
import Login from './Components/Login'
import PrivateRoute from './Components/PrivateRoute'

function App() {

  return (
    <>
     <BrowserRouter>
       <Routes>
          <Route element={<PrivateRoute />}>
          <Route path='/' element={<Home />} />
          </Route>
          <Route path='/signin' element={<Login />} />
          <Route path='/signup' element={<Register />} />
        </Routes>
      </BrowserRouter>
      {/* <Register /> */}
      {/* <Home /> */}
    </>
  )
}

export default App
