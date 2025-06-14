import re
import os
import json
from openai import OpenAI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

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

@app.get("/query")
def query_plant(plant: str):

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
        return structured_info
    except Exception as e:
        return {"error": str(e)}
