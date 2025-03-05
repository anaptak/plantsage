import os
from openai import OpenAI
from flask import Flask, redirect, render_template, request, url_for
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()

client = OpenAI()
if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("No OPENAI_API_KEY found in environment!")


if not openai.api_key:
    raise ValueError("No OPENAI_API_KEY found in environment!")

@app.route("/", methods=("GET", "POST"))
def index():
    if request.method == "POST":
        plant = request.form["plant"]
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a bot that provides structured plant care information."},
                {"role": "user", "content": generate_prompt(plant)}
            ],
            max_tokens=400,
            temperature=0,
        )
        result = response.choices[0].message.content.replace("\n", "<br>")
        conditions, plant_description = parse_conditions(result)
        return render_template("index.html", conditions=conditions, plant_description=plant_description)

    result = request.args.get("result")
    return render_template("index.html", conditions=None)

def generate_prompt(plant):
    return """For {}, print description for plant around 200 words long, good light intensity, daylight hours, temperature (fahrenheit only), air moisture (high/medium/low, comma, percentage range), soil type, soil mixture recommendation, pH, root system (e.g. deep/shallow but can be more descriptive), watering instructions (including how often to water), soil moisture, fertilization recommendations, and extra notes (about growing this plant) around 200 words long. Display the information in the following parameters in this strict specific order and format (condition: chatgptanswer,) and strictly maintaining exact parameter names: Description, Light Intensity (text with no numbers, use words like bright/full/shade), Daylight Hours, Temperature, Air Moisture, Soil Type, Soil Mixture, pH, Root System, Watering Instructions, Soil Moisture, Fertilization, Grow Notes. Data displayed for these conditions should not contradict each other. If a plant is fictional, come up with appropriate humorous values directly related to their fictional background.""".format(plant.capitalize())

def parse_conditions(result):
    conditions = [
        {"type": "Description", "answer": ""},
        {"type": "Light Intensity", "answer": ""},
        {"type": "Daylight Hours", "answer": ""},
        {"type": "Temperature", "answer": ""},
        {"type": "Air Moisture", "answer": ""},
        {"type": "Soil Type", "answer": ""},
        {"type": "Soil Mixture", "answer": ""},
        {"type": "pH", "answer": ""},
        {"type": "Root System", "answer": ""},
        {"type": "Watering Instructions", "answer": ""},
        {"type": "Soil Moisture", "answer": ""},
        {"type": "Fertilization", "answer": ""},
        {"type": "Grow Notes", "answer": ""}
    ]

    lines = result.split("<br>")
    for line in lines:
        for condition in conditions:
            if condition["type"] in line:
                answer = line.replace(condition["type"], "").strip()
                answer = answer.strip(":")
                condition["answer"] = answer
                break

    plant_description = conditions.pop(0)["answer"]

    return conditions, plant_description

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
