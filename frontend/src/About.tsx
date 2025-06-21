import plantsageLogo from './assets/plantsage_logo.PNG';
import skyGrass from './assets/sky_grass.jpg';

function About() {
  return (
    <div
      className="pt-8"
      style={{
        backgroundImage: `url(${skyGrass})`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100dvh",
      }}
    >
      <div className="bg-white/80 p-10 md:p-16 max-w-3xl mx-auto rounded-2xl shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-center gap-4 mb-6">
          <img src={plantsageLogo} alt="PlantSage Logo" className="w-14 h-14" />
          <h1 className="text-3xl md:text-4xl font-bold text-green-800">About Plant Sage</h1>
        </div>
        <p className="text-md leading-relaxed mb-12 text-gray-800">
          Plant Sage was created to give comprehensive plant care guidance without the need to sift through blog posts, ads, and personal anecdotes. It’s a straightforward tool that provides clear, structured care tips for your plants based on their names.        </p>
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-700 mb-4">What PlantSage Does</h2>
          <p className="mb-2 text-sm">Just type in a plant name and get tips on:</p>
          <ul className="text-sm list-disc list-inside space-y-2">
            <li>🌞 Light, temperature, and humidity needs</li>
            <li>🌱 Soil type, container info, and pH preferences</li>
            <li>💧 Watering, fertilizing, pruning advice, and more</li>
            <li>🖨️ Print-friendly care tables</li>
          </ul>
          <p className="text-sm mt-8">
            Results are generated live using GPT-4o then formatted for readability with a clean, mobile-friendly UI built from scratch.
          </p>
          <p className="text-sm mt-4">
            Plant Sage remembers past results for plants, so if someone has searched for yours before, your results will come quickly! Otherwise, it might take a few seconds to generate the first time.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Why I Built It</h2>
          <p className="text-sm">
            I used to spend a lot of time Googling plant care questions and wading through blog posts that often didn't have the info I needed. As chatbots became more accurate, they were a convenient way to get plant care questions answered directly. But still, the responses were verbose, and repeatedly typing out the same set of questions became tedious.
          </p>
          <p className="mt-4 text-sm">
            So I built a small tool: a single GPT-4o query that returned structured guidance based on the plant's name. It started as a simple idea, but worked well and I've had fun continuing to add features to it since then.
          </p>
        </section>

        <section className="mb-10">
            <h2 className="text-xl font-semibold text-green-700 mb-4">What’s Next</h2>
            <p>Here are some new features I'm planning next:</p>
            <ul className="list-disc list-inside space-y-2 mt-4 text-sm">
                <li>📷 Plant identification tool</li>
                <li>🌿 Personal garden to save and organize your plants</li>
                <li>📍 Define rooms/locations with survivability insights</li>
                <li>📊 Sortable table with abbreviated care info (e.g. light, water, temp)</li>
                <li>🔍 Filter and search plants by name, conditions, or tags</li>
            </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Tech Stack</h2>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Backend:</strong> FastAPI + OpenAI API</li>
            <li><strong>Frontend:</strong> React + TailwindCSS</li>
            <li><strong>Deployment:</strong> AWS EC2 with plans for CI/CD & caching</li>
          </ul>
        </section>

        <section className="mb-10">
            <h2 className="text-xl font-semibold text-green-700 mb-4">About Me</h2>
            <p className="text-sm">
                Hi, my name is Ana Ptak, and I'm an engineer who loves plants. 
            </p>
            <p className="mt-4 text-sm">
                I achieved my Bachelor's in Electrical Engineering from UC Davis 8 years ago, and started working as a Product Development Engineer at Intel shortly after. 
                Working with hardware has been great, but the best parts of my job have always been the software tools I use and create for validating and testing products.
            </p>
            <p className="mt-4 text-sm">
                Recently, I decided to dive deeper into software development and am now pursuing a Master's in Computer Science at Georgia Tech.
            </p>
            <p className="mt-4 text-sm">
                When I'm not working or studying, you might find me:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 mb-4 text-sm">
                <li>🐕 Teaching my old German Shepherd, Bruce, some new tricks</li>
                <li>🌿 Tending to my jungle of plants</li>
                <li>⛰️ Taking amateur photography while exploring national parks</li>
                <li>🍻 Playing trivia with my friends around Sacramento</li>
                <li>🎸 Fingerpicking on my trusty old Martin 000X1</li>
                
            </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Let’s Connect</h2>
          <p>
            Got feedback or ideas? Want to geek out over plants and code? Feel free to reach out via <a href="mailto:anaptak.dev@email.com" className="underline text-green-700">email</a> or <a href="https://github.com/anaptak" className="underline text-green-700">GitHub</a>.
          </p>
        </section>

        <div className="text-center">
          <a href="/" className="inline-block bg-green-700 text-white px-6 py-3 rounded-full shadow hover:bg-green-800 transition">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;
