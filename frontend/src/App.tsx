import { useState, useRef, useEffect } from 'react';
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import plantsageLogo from './assets/plantsage_logo.PNG';
import backgroundEarth from './assets/background_extended.jpg';
import './App.css';

function App() {
  const [plantName, setPlantName] = useState('');
  const [responseData, setResponseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [plantTitle, setPlantTitle] = useState('');
  const [plantDescription, setPlantDescription] = useState('');
  const [bgPositionY, setBgPositionY] = useState('');

  const heroRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/background_extended.jpg";
    img.onload = () => {
      const imageHeight = img.naturalHeight;
      const desiredBottomY = 1400;
      const screenHeight = window.innerHeight;
      const initialOffsetPx = desiredBottomY - screenHeight;
      const finalOffsetPercent = (initialOffsetPx / imageHeight) * 100;
      setBgPositionY(`center ${finalOffsetPercent}%`);
    };
  }, []);

  useEffect(() => {
    if (!responseData || !containerRef.current) return;
    const img = new Image();
    img.src = "/background_extended.jpg";
    img.onload = () => {
      const imageHeight = img.naturalHeight;
      const desiredBottomY = 2400;
      const screenHeight = window.innerHeight;
      const initialOffsetPx = desiredBottomY - screenHeight;
      const oldHeight = heroRef.current?.offsetHeight || 0;
      const newHeight = containerRef.current?.offsetHeight || oldHeight;
      const deltaCenter = (newHeight - oldHeight) / 2;
      const finalOffsetPx = initialOffsetPx + deltaCenter;
      const finalOffsetPercent = (finalOffsetPx / imageHeight) * 100;
      setBgPositionY(`center ${finalOffsetPercent}%`);
    };
  }, [responseData]);

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
    } catch (err) {
      console.error(err);
      setPlantTitle('');
      setPlantDescription('');
      setResponseData({ error: "Sorry, we couldn't fetch plant info at this time." });
    } finally {
      setIsLoading(false);
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
      environment: "#8ed7d5",
      planting: "#b1d6a8",
      care: "#d7c3a8"
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
            <h2 className="text-lg font-semibold text-[#F5E8A8] mb-6 mt-12 shadow-md">
              Here's the dirt on...
            </h2>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#F5E8A8] font-['Playfair_Display'] shadow-md">
              {plantTitle}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#F1F1F1] leading-relaxed shadow-md px-2">
              {plantDescription}
            </p>
          </div>
        )}

        <div className="block lg:hidden space-y-4">
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

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-[90%] max-w-4xl table-auto mx-auto border-separate border-spacing-0 border-2 border-gray-800 rounded-xl overflow-hidden shadow-lg">
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
                          className="text-center align-middle font-semibold text-sm text-gray-800 px-3 py-2 border border-gray-800 w-1/5"
                          style={{ backgroundColor: darkBg }}
                        >
                          {sectionLabels[section]}
                        </td>
                      )}
                      <td 
                        className="px-3 py-2 font-bold text-sm text-gray-900 border border-gray-800 w-1/4" 
                        style={{ backgroundColor: lightBg }}
                      >
                        {formatKey(key)}
                      </td>
                      <td 
                        className="px-3 py-2 text-sm text-gray-800 border border-gray-800 w-1/2" 
                        style={{ backgroundColor: lightBg }}
                      >
                        {String(value)}
                      </td>
                    </tr>
                  );
                });
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const formatKey = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div
      ref={containerRef}
      style={{
        backgroundImage: `url(${backgroundEarth})`,
        backgroundPosition: bgPositionY,
        backgroundSize: "cover",
        backgroundAttachment: "scroll",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        ref={heroRef}
        className="relative h-screen"
      >
        <div className="flex flex-col items-center justify-start h-full text-center pt-12 sm:pt-16">
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
        </div>
      </div>

      {responseData && !responseData.error && (
        <div ref={resultsRef} className="flex flex-col items-center justify-center min-h-[120vh] text-center">
          {renderTable()}
        </div>
      )}
    </div>
  );
}

export default App;
