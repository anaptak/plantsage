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
    "http://localhost:5173"
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
        "environment": {{
            "light_intensity": "",
            "daylight_hours": "",
            "temperature": "",
            "air_moisture": ""
        }},
        "planting": {{
            "soil_type": "",
            "soil_mixture": "",
            "pH": "",
            "root_system": ""
        }},
        "care": {{
            "watering_instructions": "",
            "soil_moisture": "",
            "fertilization": "",
            "grow_notes": ""
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
        structured_info = json.loads(raw_content)
        return structured_info
    except Exception as e:
        return {"error": str(e)}
