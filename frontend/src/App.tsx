import { useState } from 'react';
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Info } from "lucide-react";
import plantsageLogo from './assets/plantsage_logo.PNG';
import skyGrass from './assets/sky_grass.jpg';
import grassDirt from './assets/grass_dirt.jpg';
import About from './About';
import './App.css';

function App() {
  if (window.location.pathname == "/about") {
    return <About />;
  }
  const [plantName, setPlantName] = useState('');
  const [responseData, setResponseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [plantTitle, setPlantTitle] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Getting Plant Info...');
  const [plantDescription, setPlantDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!plantName) return;
    try {
      setIsLoading(true);
      setSubmitted(false);
      setResponseData(null);
      setLoadingMessage('Getting Plant Info...');
      const apiBase = import.meta.env.VITE_API_URL || "";
      try {
        const checkRes = await fetch(`${apiBase}/cache_status?plant=${encodeURIComponent(plantName)}`);
        const check = await checkRes.json();
        if (!check.cached) {
          setLoadingMessage('Sprouting info for a new plant... hang tight!');
        }
      } catch (err) {
        console.error('Cache check failed', err);
      }
      const res = await fetch(`${apiBase}/query?plant=${encodeURIComponent(plantName)}`);
      const data = await res.json();
      setPlantTitle(data.title || '');
      setPlantDescription(data.description || '');
      setResponseData(data);
      setSubmitted(true);
      window.scrollTo({"top": 0, behavior: 'smooth' });
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
      <div id="print-area" className="w-full px-4 py-1">
        {plantTitle && (
          <div className="relative mt-4 mb-10 text-center max-w-3xl mx-auto">
            <div 
              className="absolute inset-0 mx-auto max-w-2xl h-full blur-xl rounded-xl pointer-events-none z-0"
                style={{
                  backgroundColor: 'rgba(20, 12, 6, 0.75)',
                  boxShadow: '0 0 100px 10px rgba(20, 12, 6, 0.6)',
                  filter: 'blur(35px)',
                  borderRadius: '1rem',
                }}
            />
            <div className="relative z-10 px-4 py-4">
              <h2 className="text-lg text-[#F5E8A8] mb-4 no-print">
                Here's the dirt on...
              </h2>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#F5E8A8] font-['Playfair_Display']">
                {plantTitle}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-left text-[#F1F1F1] leading-relaxed px-2">
                {plantDescription}
              </p>
            </div>
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
                    <div className="text-base text-left text-gray-800 leading-relaxed">
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
                        className="px-4 py-3 font-bold text-center text-sm text-gray-900 w-1/4"
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
        backgroundPosition: submitted ? "top" : "bottom",
        backgroundRepeat: "no-repeat",
        minHeight: "100dvh",
      }}
      className="relative"
    >
      <a
        href="/about"
        aria-label="About Plant Sage"
        className="no-print absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-[#18794e] hover:text-[#14532d] rounded-full bg-white/70 hover:bg-white shadow backdrop-blur-sm transition-all duration-300"
      >
        <Info size={16} strokeWidth={2} />
        <span className="hidden sm:inline">About Plant Sage</span>
      </a>
      <div
        className={`no-print flex flex-col items-center text-center ${
          submitted ? "justify-start pt-12 sm:pt-16" : "justify-center min-h-[100dvh]"
        }`}
      >
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
            {!(isLoading && loadingMessage.includes('Sprouting info')) && (
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`mt-3 px-6 py-5 text-base text-white rounded-[10px] shadow transition-all duration-200 transform ${
                  isLoading ? "bg-[#2c4539]" : "bg-[#18794e] hover:bg-[#2c4539] hover:scale-105"
                }`}
              >
                {isLoading ? "Loading..." : "Get Care Tips"}
              </Button>
            )}
            {isLoading && (
              <div className="mt-6 flex flex-col items-center gap-2 px-4">
               <p className="text-[#1d1f1e] bg-white/90 px-3 py-1 rounded-xl shadow-md">
                  {loadingMessage}
                </p>
                <div className="relative w-60 h-4 bg-green-100 rounded-full overflow-hidden border border-[#18794e] shadow">
                  <div
                    key={plantName + Date.now()}
                    className="absolute top-0 left-0 h-full bg-[#18794e] rounded-full animate-growBar"
                  ></div>
                <div className="progress-icon"></div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {responseData && !responseData.error && (
        <div className="flex flex-col items-center justify-center text-center py-12">
          {renderTable()}

          <Button
            onClick={() => window.print()}
            className="no-print mt-6 px-6 py-3 mb-8 rounded-full text-sm sm:text-base font-medium text-white bg-gradient-to-r from-[#5C8A4D] to-[#339C99] hover:from-[#2c4539] hover:to-[#18794e] shadow-lg transition-transform duration-300 transform hover:scale-105"
          >
            🖨️ Print These Tips
          </Button>
          <div className="no-print mt-6 flex flex-col items-center">
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
                  {loadingMessage}
                </>
              ) : (
                "Get Care Tips"
              )}
            </Button>
            {isLoading && (
              <div className="mt-3 w-60 h-2 bg-gray-200 rounded overflow-hidden">
                <div className="loading-bar h-full w-1/2 bg-[#18794e]"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
