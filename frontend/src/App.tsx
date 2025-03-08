import { useState } from 'react'
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
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
