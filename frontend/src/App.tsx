import { useState } from 'react'
import { Input } from "@/components/ui/input"
import plantsageLogo from './assets/plantsage_logo.PNG'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="center-container">
        <img src={plantsageLogo} className="logo" alt="PlantSage Logo" />
      </div>

      <h1>Plant Sage</h1>

      <div className="flex justify-center my-4">
        <Input placeholder="Enter the Name of a Plant"
        className="w-64 bg-gray-50 text-stone-950 border border-gray-300 rounded-md" />
      </div>

      <div className="card">
        <button type="button">Get Info</button>
      </div>
    </>
  )
}

export default App
