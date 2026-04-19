
import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Login from './pages/Login'
import { useDispatch } from 'react-redux'
import { login, setLoading } from './app/features/authSlice'
import { Toaster } from 'react-hot-toast'
import api from './configs/api'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {

  const dispatch = useDispatch()
  const getUserData = async()=>{
    const token = localStorage.getItem('token')
    try{
      if(token){
        const { data } = await api.get('/api/users/data', {headers: {Authorization: token}})
        if(data.user){
          dispatch(login({token, user: data.user}))
        }
        dispatch(setLoading(false))
      }else{
        dispatch(setLoading(false))
      }
    }catch(error){
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
      }
      dispatch(setLoading(false))
      console.log("Authentication check:", error.message)
    }
  }

  useEffect(()=>{
    getUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  return (
    <>
    <Toaster/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>

        <Route element={<ProtectedRoute/>}>
          <Route path='app' element={<Layout/>}>
            <Route index element={<Dashboard/>}/>
            <Route path='builder/:resumeId' element={<ResumeBuilder/>}/>
          </Route>
        </Route>

        <Route path='view/:resumeId' element={<Preview/>}/>
        
      </Routes>
    </>
      
   
  )
}

export default App
