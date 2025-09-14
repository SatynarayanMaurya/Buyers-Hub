import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {ToastContainer} from "react-toastify"
import {BrowserRouter } from "react-router-dom"
import { store } from './redux/store.js'
import {Provider} from "react-redux"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Provider store ={store}>

    <App />
    </Provider>
    </BrowserRouter>
    <ToastContainer autoClose={2000}/>
  </StrictMode>,
)
