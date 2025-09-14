import React from 'react'
import Signup from './pages/SignupPage'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import AgentDashboard from './components/Agent Dashbaord/AgentDashboard'
import AddBuyerForm from './components/Agent Dashbaord/AddBuyerForm'

function App() {
  return (
    <div >
      <Routes>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/buyers' element={<AgentDashboard/>}/>
        <Route path='/buyers/new' element={<AddBuyerForm/>}/>
      </Routes>
      
      
    </div>
  )
}

export default App
