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
      <div className="table-container">
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
    <div className="app-container">
      <div className="center-container">
        <img src={plantsageLogo} className="logo" alt="PlantSage Logo" />
        <h1 className="title">Plant Sage</h1>
        <Input
          classnName="input"
          type="text"
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
          placeholder="Enter the Name of a Plant"
        />
        <Button className="get-info-button" onClick={handleSubmit}>Get Info</Button>
        {renderTable()}
      </div>
    </div>
  );
}

export default App;