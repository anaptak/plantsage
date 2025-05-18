import { useState } from 'react';
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import plantsageLogo from './assets/plantsage_logo.PNG';
import './App.css';

function App() {
  const [plantName, setPlantName] = useState('');
  const [responseData, setResponseData] = useState<any>(null);

  const handleSubmit = async () => {
    if (!plantName) return;

    try {
      const res = await fetch(`http://localhost:8000/query?plant=${encodeURIComponent(plantName)}`);
      const data = await res.json();
      setResponseData(data); 
    } catch (err) {
      console.error(err);
      setResponseData({ error: "Could not fetch plant info." });
    }
  };

  const renderTable = () => {
    if (!responseData || responseData.error) return null;

    const sectionOrder = ["environment", "planting", "care"];

    return (
      <div className="flex items-center justify-center h-screen text-center max-w-screen-xl mx-auto p-8">
        {sectionOrder.map((section) => (
          <div key={section}>
            <h2>{section.charAt(0).toUpperCase() + section.slice(1)}</h2>
            <table>
              <tbody>
                {Object.entries(responseData[section]).map(([key, value]) => (
                  <tr key={key}>
                    <td className="key">{formatKey(key)}</td>
                    <td className="value">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  };

  const formatKey = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[url('/sky_grass.png')] bg-no-repeat bg-center bg-cover text-center max-w-screen-xl mx-auto p-8">
      <div className="flex flex-col items-center justify-center h-[30vh] text-center">
        <img 
          src={plantsageLogo} 
          alt="PlantSage Logo"
          className="w-24 h-24 mb-4" />
        <h1 className="text-[3rem] font-bold text-[#2c4539] mb-4 tracking-wide [text-shadow:1px_1px_2px_rgba(0,0,0,0.05)] font-['Playfair_Display']">
          Plant Sage
        </h1>
        <Input
          type="text"
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
          placeholder="Enter the Name of a Plant"
          className="h-14 text-base px-4 py-3 rounded-xl w-[260px] shadow-sm border border-[#18794e] bg-white"
        />
        <Button 
          onClick={handleSubmit}
          className="mt-3 px-6 py-3 text-base bg-[#18794e] text-white rounded-[10px] shadow hover:bg-[#2c4539]">
          Get Info
        </Button>
        {renderTable()}
      </div>
    </div>
  );
}

export default App;