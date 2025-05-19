import { useState, useRef, useEffect } from 'react';
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
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      console.error(err);
      setResponseData({ error: "Could not fetch plant info." });
    }
  }

  const renderTable = () => {
    if (!responseData || responseData.error) return null;

    const sectionOrder = ["environment", "planting", "care"];
    const sectionLabels: Record<string, string> = {
      environment: "Environment",
      planting: "Planting",
      care: "Care",
    };

    const sectionDarkColors: Record<string, string> = {
      environment: "#8ed7d5",
      planting: "#b1d6a8",
      care: "#d7c3a8"
    };

    const sectionLightColors: Record<string, string> = {
      environment: "#e9f6f8",
      planting: "#e2eedd",
      care: "#efe8df"
    };

    return (
      <div className="overflow-x-auto w-full px-4 py-12">
        <table className="w-[90%] max-w-4xl table-auto mx-auto border border-gray-300 rounded-xl overflow-hidden shadow">
          <tbody>
            {sectionOrder.map((section) => {
              const entries = Object.entries(responseData[section]);
              return entries.map(([key, value], idx) => {
                const isFirstRow = idx === 0;
                const darkBg = sectionDarkColors[section];
                const lightBg = sectionLightColors[section];

                return (
                  <tr key={key}>
                    {isFirstRow && (
                      <td
                        rowSpan={entries.length}
                        className={`text-center align-middle font-semibold text-sm text-gray-800 px-3 py-1.5 border border-gray-300 w-1/5`}
                        style={{ backgroundColor: darkBg }}
                      >
                        {sectionLabels[section]}
                      </td>
                    )}
                    <td 
                      className={`px-3 py-1.5 font-semibold text-sm text-gray-900 border border-gray-300 w-1/4`}
                      style={{ backgroundColor: lightBg }}
                    >
                      {formatKey(key)}
                    </td>
                    <td 
                      className={`px-3 py-1.5 text-sm text-gray-800 border border-gray-300 w-1/2`}
                      style={{ backgroundColor: lightBg }}
                    >
                      {value}
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const formatKey = (key: string) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  const resultsRef = useRef<HTMLDivElement | null>(null);
  return (
    <>
      <div
        className="bg-no-repeat bg-cover"
        style={{
          backgroundImage: "url('/background_earth.png')",
          backgroundPosition: "center 30%",
          backgroundSize: "cover",
          backgroundAttachment: "scroll", // or 'fixed' if you want it to stay pinned
        }}
      >
        <div className="flex items-center justify-center h-screen text-center max-w-screen-xl mx-auto p-8">
          <div className="flex flex-col items-center justify-center h-[30vh] text-center">
            <img 
              src={plantsageLogo} 
              alt="PlantSage Logo"
              className="w-24 h-24 mb-4" 
            />
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
              className="mt-3 px-6 py-3 text-base bg-[#18794e] text-white rounded-[10px] shadow hover:bg-[#2c4539]"
            >
              Get Info
            </Button>
          </div>
        </div>

        {responseData && !responseData.error && (
          <div
            ref={resultsRef}
            className="flex flex-col items-center justify-center min-h-[120vh] text-center"
          >
            {renderTable()}
          </div>
        )}
      </div>
    </>
  );
}

export default App;