import { useState } from 'react';
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import plantsageLogo from './assets/plantsage_logo.PNG';
import skyGrass from './assets/sky_grass.jpg';
import grassDirt from './assets/grass_dirt.jpg';
import './App.css';

function App() {
  const [plantName, setPlantName] = useState('');
  const [responseData, setResponseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [plantTitle, setPlantTitle] = useState('');
  const [plantDescription, setPlantDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!plantName) return;
    try {
      setIsLoading(true);
      const apiBase = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${apiBase}/query?plant=${encodeURIComponent(plantName)}`);
      const data = await res.json();
      setPlantTitle(data.title || '');
      setPlantDescription(data.description || '');
      setResponseData(data);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setPlantTitle('');
      setPlantDescription('');
      setResponseData({ error: "Sorry, we couldn't fetch plant info at this time." });
    } finally {
      setIsLoading(false);
      setPlantName('');
    }
  };

  const renderTable = () => {
    if (!responseData || responseData.error) return null;

    const sectionOrder = ["environment", "planting", "care"] as const;
    type Section = typeof sectionOrder[number];

    const sectionLabels: Record<Section, string> = {
      environment: "Environment",
      planting: "Planting",
      care: "Care",
    };

    const sectionDarkColors: Record<Section, string> = {
      environment: "#339C99",
      planting: "#5C8A4D",
      care: "#A07851"
    };

    const sectionLightColors: Record<Section, string> = {
      environment: "#e9f6f8",
      planting: "#e2eedd",
      care: "#efe8df"
    };

    return (
      <div className="w-full px-4 py-12">
        {plantTitle && (
          <div className="mb-8 text-center max-w-3xl mx-auto">
            <h2 className="text-lg font-semibold text-[#F5E8A8] mb-6 mt-12">
              Here's the dirt on...
            </h2>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5E8A8] font-['Playfair_Display']">
              {plantTitle}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#F1F1F1] leading-relaxed px-2">
              {plantDescription}
            </p>
          </div>
        )}

        <div className="block sm:hidden space-y-4">
          {sectionOrder.map((section) => (
            <div key={section} className="bg-white rounded-xl shadow-lg border border-gray-300 overflow-hidden">
              <h3
                className="text-lg font-bold text-white px-6 py-4 text-center"
                style={{ backgroundColor: sectionDarkColors[section] }}
              >
                {sectionLabels[section]}
              </h3>
              <div className="divide-y divide-gray-200">
                {Object.entries(responseData[section]).map(([key, value]) => (
                  <div
                    key={key}
                    className="px-6 py-4"
                    style={{ backgroundColor: sectionLightColors[section] }}
                  >
                    <div className="font-bold text-base text-gray-900 mb-2">
                      {formatKey(key)}
                    </div>
                    <div className="text-base text-gray-800 leading-relaxed">
                      {String(value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden sm:block space-y-8 px-6 max-w-5xl mx-auto">
          {sectionOrder.map((section) => (
            <div key={section} className="rounded-xl shadow-lg border border-gray-400 overflow-hidden">
              <h3
                className="text-md font-bold text-white px-6 py-2 text-center"
                style={{ backgroundColor: sectionDarkColors[section] }}
              >
                {sectionLabels[section]}
              </h3>
              <table className="w-full table-auto border-collapse">
                <tbody>
                  {Object.entries(responseData[section]).map(([key, value]) => (
                    <tr key={key} className="border-t border-gray-300">
                      <td
                        className="px-4 py-3 font-bold text-center text-sm text-gray-900 w-1/3"
                        style={{ backgroundColor: sectionLightColors[section] }}
                      >
                        {formatKey(key)}
                      </td>
                      <td
                        className="px-4 py-3 text-left text-sm text-gray-800"
                        style={{ backgroundColor: sectionLightColors[section] }}
                      >
                        {String(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const formatKey = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div
      style={{
        backgroundImage: `url(${submitted ? grassDirt : skyGrass})`,
        backgroundSize: "cover",
        backgroundPosition: submitted? "top" : "bottom",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="flex flex-col items-center justify-start text-center pt-12 sm:pt-16">
        {!submitted && (
          <>
            <img src={plantsageLogo} alt="PlantSage Logo" className="w-28 h-28 mb-2" />
            <h1 className="text-[3rem] font-bold text-[#2c4539] tracking-wide [text-shadow:1px_1px_2px_rgba(0,0,0,0.05)] font-['Playfair_Display'] mb-5">
              Plant Sage
            </h1>
            <p className="text-[#2c4539] text-sm mb-8 italic font-medium">
              Plant Smarter, Not Harder
            </p>
            <Input
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="Enter your plant name..."
              className="h-12 text-center px-4 py-3 rounded-2xl w-[260px] shadow-sm border border-[#18794e] bg-gray-50 placeholder:text-gray-500"
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`mt-3 px-6 py-5 text-base text-white rounded-[10px] shadow transition-all duration-200 transform ${
                isLoading ? "bg-[#2c4539]" : "bg-[#18794e] hover:bg-[#2c4539] hover:scale-105"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                  </svg>
                  Getting Plant Info...
                </>
              ) : (
                "Get Care Tips"
              )}
            </Button>
          </>
        )}
      </div>
      {responseData && !responseData.error && (
        <div className="flex flex-col items-center justify-center text-center py-12">
          {renderTable()}
          <div className="mt-6 flex flex-col items-center">
            <Input
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="Enter your next plant name..."
              className="h-12 text-center px-4 py-3 rounded-2xl w-[260px] shadow-sm border border-[#18794e] bg-gray-50 placeholder:text-gray-500"
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`mt-3 px-6 py-5 text-base text-white rounded-[10px] shadow transition-all duration-200 transform ${
                isLoading ? "bg-[#2c4539]" : "bg-[#18794e] hover:bg-[#2c4539] hover:scale-105"
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 000 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
                  </svg>
                  Getting Plant Info...
                </>
              ) : (
                "Get Care Tips"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
