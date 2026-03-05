import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter,Route, Routes} from "react-router-dom";
import Header from "./components/Header.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <BrowserRouter>
            <div className={"min-h-screen bg-gray-100"}>
                <Header/>
            </div>
        </BrowserRouter>

    </>
  )
}

export default App
