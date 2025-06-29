import re
import os
import json
import time
import sqlite3
from openai import OpenAI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from cachetools import LRUCache

load_dotenv()

app = FastAPI()

cache = LRUCache(maxsize=int(os.getenv("CACHE_MAXSIZE", 5000)))

def init_db() -> None:
    conn = sqlite3.connect("db.sqlite3")
    c = conn.cursor()
    c.execute(
        "CREATE TABLE IF NOT EXISTS plant_cache (plant TEXT PRIMARY KEY, data TEXT, timestamp INTEGER)"
    )
    conn.commit()
    conn.close()

init_db()

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://plantsage.ai",
    "https://plantsage.ai",
    "http://www.plantsage.ai",
    "https://www.plantsage.ai"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.get("/cache_status")
def cache_status(plant: str):
    """Return whether cached data exists for the given plant."""
    key = plant.lower().strip()
    if key in cache:
        return {"cached": True, "first_time": False}
    now = int(time.time())
    conn = sqlite3.connect("db.sqlite3")
    c = conn.cursor()
    c.execute("SELECT timestamp FROM plant_cache WHERE plant=?", (key,))
    row = c.fetchone()
    conn.close()
    if row:
        return {"cached": True, "first_time": False}
    return {"cached": False, "first_time": True}

@app.get("/query")
def query_plant(plant: str):
    key = plant.lower().strip()
    now = int(time.time())

    entry = cache.get(key)
    if entry:
        return {**entry, "cached": True}

    conn = sqlite3.connect("db.sqlite3")
    c = conn.cursor()
    c.execute("SELECT data, timestamp FROM plant_cache WHERE plant=?", (key,))
    row = c.fetchone()
    if row:
        data = json.loads(row[0])
        cache[key] = {"data": data, "timestamp": row[1]}
        conn.close()
        return {**data, "cached": True}
    conn.close()

    prompt = f"""
    You are a helpful plant care assistant. Provide detailed, expert-level guidance for growing this plant: {plant}.
    Respond strictly in this JSON format:

    {{
        "title": "",  // Common or scientific name of the plant
        "description": "",  // 1–2 sentence overview of the plant's characteristics or appeal
        "environment": {{
            "light": "",  // Ideal, tolerable, and poor lighting conditions
            "temperature": "",  // // Optimal and tolerable temperature ranges (including highest tolerable temperature), including seasonal needs
            "humidity": "",  // Preferred humidity levels and how sensitive the plant is to deviations
            "native habitat": ""  // Brief description of the plant's natural environment, e.g., tropical, desert, etc.
        }},
        "planting": {{
            "soil": "",  // Soil blend (with exact ratios in numbers) for indoor growth or recommended soil types for outdoor; mention drainage needs
            "containment": "",  // Specify if plant is Indoor and/or Outdoor. Recommendations based on root system: e.g., deep pot, wide pot, spacing for ground planting
            "pH": ""  // Acceptable pH range and its importance for this plant
        }},
        "care": {{
            "watering": "",  // Frequency, method, and tips specific to this plant’s hydration needs
            "fertilization": "",  // Whether fertilization matters, suggested types (e.g., NPK ratios or organic), and frequency
            "pruning": "",  // How and when to prune (if needed), including any specific techniques or tools
            "care_notes": ""  // Additional expert tips that would help a user grow this plant successfully
        }}
    }}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            temperature=0.2,
            messages=[{"role": "user", "content": prompt}]
        )
        raw_content = response.choices[0].message.content
        cleaned = re.sub(r"^```(?:json)?|```$", "", raw_content.strip(), flags=re.MULTILINE).strip()
        structured_info = json.loads(cleaned)

        cache[key] = structured_info
        conn = sqlite3.connect("db.sqlite3")
        c = conn.cursor()
        c.execute(
            "INSERT OR REPLACE INTO plant_cache(plant, data, timestamp) VALUES (?, ?, ?)",
            (key, json.dumps(structured_info), now),
        )
        conn.commit()
        conn.close()
        return {**structured_info, "cached": False}
    except Exception as e:
        return {"error": str(e)}
