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
    You are a helpful plant care assistant. Provide detailed care information about the plant: {plant}.
    Return the result strictly in this JSON format:

    {{
        "title": "",  // common name or scientific name of the plant
        "description": "",  // 1-2 sentence description of the plant
        "environment": {{
            "light": "",
            "temperature": "",
            "humidity": ""
        }},
        "planting": {{
            "soil_blend": "",   // provide ratios
            "container": "",    // deep, wide, etc. based on root system
            "pH": ""
        }},
        "care": {{
            "watering": "", // frequency, amount
            "fertilization": "",
            "care_notes": ""
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
