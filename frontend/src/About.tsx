import plantsageLogo from './assets/plantsage_logo.PNG';
import skyGrass from './assets/sky_grass.jpg';

function About() {
  return (
    <div
      style={{
        backgroundImage: `url(${skyGrass})`,
        backgroundSize: "cover",
        backgroundPosition: "bottom",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100dvh",
      }}
    >
      <div className="bg-white/80 p-10 md:p-16 max-w-3xl mx-auto mt-10 rounded-2xl shadow-lg backdrop-blur-sm">
        <img src={plantsageLogo} alt="PlantSage Logo" className="w-28 h-28 mb-2" />
        <h1 className="text-4xl font-bold text-green-800 mb-6 text-center"> About Plant Sage</h1>
        <p className="text-lg leading-relaxed mb-12 text-gray-800">
          Plant Sage was created to give simple, smart, and tailored guidance for plant care. Whether you're just starting your garden or you're a seasoned green thumb, Plant Sage provides AI-powered guidance that’s clear, fast, and fluff-free.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">What PlantSage Does</h2>
          <p className="mb-2">Just type in a plant name and get personalized tips on:</p>
          <ul className="list-disc list-inside space-y-2">
            <li>🌞 Light, temperature, and humidity needs</li>
            <li>🌱 Soil type, container info, and pH preferences</li>
            <li>💧 Watering, fertilizing, pruning advice, and more</li>
          </ul>
          <p className="mt-8">
            Results are generated live using OpenAI, then formatted for readability with a clean, mobile-friendly UI built from scratch.
          </p>
          <p className="mt-4">
            Plant Sage remembers past results for plants, so if someone has searched for yours before, your results will come quickly! Otherwise, it might take a few seconds to generate the first time.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Why I Built It</h2>
          <p>
            After too many rabbit holes of blog posts, pop-ups, and personal anecdotes just to figure out how to water a plant, I figured there must be a better way. I wanted something clean and simple with no fluff, no ads, just clear plant care advice.
            </p>
            <p className="mt-4">
            So I built a small tool: a single OpenAI query that returned structured guidance based on the plant's name. What started as a quick hack has turned into an ongoing project to make plant care easier, clearer, and more fun for myself.
          </p>
        </section>

        <section className="mb-10">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">What’s Next</h2>
            <p>Here are some new features I'm planning next:</p>
            <ul className="list-disc list-inside space-y-2 mt-4">
                <li>🖨️ Option to export or print care instructions</li>
                <li>🌿 Personal garden to save and organize your plants</li>
                <li>📍 Define rooms/locations with survivability insights</li>
                <li>📊 Sortable table with abbreviated care info (e.g. light, water, temp)</li>
                <li>🔍 Filter and search plants by name, conditions, or tags</li>
            </ul>
        </section>

        <section className="mb-10">
            <h2 className="text-2xl font-semibold text-green-700 mb-4">About Me</h2>
            <p>
                I’m a plant lover and engineer who built PlantSage to make plant care a little simpler (and to stop over-Googling every watering question). It started as a personal project but turned into something I genuinely enjoy growing.
            </p>
            <p className="mt-4">
                When I'm not coding, you might find me:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2 mb-4">
                <li>Working at Intel Foundry Services as a Product Development Engineer</li>
                <li>Studying for my Master’s in Computer Science at Georgia Tech</li>
                <li>Teaching my old German Shepherd, Bruce, some new tricks</li>
                <li>Exploring national parks</li>
                <li>Tending to my own little jungle of plants</li>
            </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Tech Stack</h2>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Backend:</strong> FastAPI + OpenAI API</li>
            <li><strong>Frontend:</strong> React + TailwindCSS</li>
            <li><strong>Deployment:</strong> AWS EC2 with plans for CI/CD & caching</li>
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
