from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

# Your OpenWeatherMap API key
API_KEY = "b9821a4b7c46c98de4ebb57990dd8098"

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/get_weather", methods=["POST"])

def get_weather():
    city = request.form["city"]
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

if __name__ == "__main__":
    app.run(debug=True)
