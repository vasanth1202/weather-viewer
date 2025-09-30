from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env

app = Flask(__name__)

# Get API key from environment variable
API_KEY = os.getenv("OPENWEATHER_API_KEY")

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get_weather", methods=["POST"])
def get_weather():
    city = request.form.get("city")
    if not city:
        return jsonify({"error": "City not provided"})

    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    response = requests.get(url)
    weather_data = response.json()

    if weather_data.get("cod") != 200:
        return jsonify({"error": "City not found"})

    data = {
        "temperature": weather_data["main"]["temp"],
        "humidity": weather_data["main"]["humidity"],
        "description": weather_data["weather"][0]["description"]
    }
    return jsonify(data)

# ← Move this route above app.run()
@app.route("/city_suggestions", methods=["GET"])
def city_suggestions():
    prefix = request.args.get("prefix", "")
    if not prefix:
        return jsonify([])

    url = "https://wft-geo-db.p.rapidapi.com/v1/geo/cities"
    headers = {
        "X-RapidAPI-Key": os.getenv("GEODB_API_KEY"),
        "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com"
    }
    params = {"namePrefix": prefix, "limit": 5}
    response = requests.get(url, headers=headers, params=params)
    data = response.json()

    suggestions = [city["name"] for city in data.get("data", [])]
    return jsonify(suggestions)


if __name__ == "__main__":
    app.run(debug=True)
