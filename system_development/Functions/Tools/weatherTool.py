from Functions.tool import Tool
from Functions.Model.config import DEFAULT_LOCATION
import requests

WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
}

class WeatherTool(Tool):
    def __init__(self):
            super().__init__(
                "get_weather",
                "Returns the current weather for a specified city."
            )

    def schema(self):
        return {
            "type": "function",
            "function": {
                "name": self.name,
                "description": (
                    "Get weather for a location and date. "
                    "If no location is provided, uses the device's current location. "
                    "If no date is provided, returns today's weather."
                ),
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": (
                                "City, town, or location. Optional. "
                                "Omit to use the device's current location."
                            )
                        },
                        "date": {
                            "type": "string",
                            "description": (
                                "Date to retrieve weather for in YYYY-MM-DD format. "
                                "Omit for today."
                            )
                        }
                    },
                    "required": []
                }
            }
        }

    def _geocode(self, location) -> dict:
        GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search"

        # Try progressively simpler searches if necessary
        search_attempts = [
            location,
            location.replace(",", ""),
            location.split(",")[0].strip()
        ]

        for candidate in search_attempts:

            location_params = {
                "name": candidate,
                "count": 5,          # Get multiple matches for disambiguation
                "language": "en"
            }

            location_response = requests.get(
                url=GEOCODE_URL,
                params=location_params,
                timeout=5
            )

            location_response.raise_for_status()

            location_data = location_response.json()

            if "results" not in location_data or not location_data["results"]:
                continue

            # If the original query specified a state, try to match it.
            if "," in location:
                requested_state = location.split(",", 1)[1].strip().lower()

                for result in location_data["results"]:
                    if result.get("admin1", "").lower() == requested_state:
                        return {
                            "name": result["name"],
                            "country": result["country"],
                            "latitude": result["latitude"],
                            "longitude": result["longitude"],
                            "timezone": result["timezone"]
                        }

            # Otherwise just return the first result
            result = location_data["results"][0]

            return {
                "name": result["name"],
                "country": result["country"],
                "latitude": result["latitude"],
                "longitude": result["longitude"],
                "timezone": result["timezone"]
            }

        raise ValueError(f"Could not find location '{location}'.")

    def _weather(self, location, date=None):
        WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

        weather_params = {
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "timezone": "auto"
        }

        # Current weather
        if date is None:
            weather_params["current"] = [
                "temperature_2m",
                "apparent_temperature",
                "wind_speed_10m",
                "weather_code"
            ]

        # Future daily forecast
        else:
            weather_params.update({
                "start_date": date,
                "end_date": date,
                "daily": [
                    "weather_code",
                    "temperature_2m_max",
                    "temperature_2m_min",
                    "apparent_temperature_max",
                    "apparent_temperature_min",
                    "precipitation_probability_max",
                    "wind_speed_10m_max"
                ]
            })

        weather_response = requests.get(
            WEATHER_URL,
            params=weather_params,
            timeout=5
        )

        weather_response.raise_for_status()
        weather_data = weather_response.json()

        # Parse current weather
        if date is None:
            if "current" not in weather_data:
                raise ValueError("Could not retrieve current weather data.")

            current = weather_data["current"]

            return {
                "location": location["name"],
                "country": location["country"],
                "type": "current",
                "time": current["time"],
                "temperature": current["temperature_2m"],
                "feels_like": current["apparent_temperature"],
                "condition": WEATHER_CODES.get(
                    current["weather_code"],
                    "Unknown"
                ),
                "wind_speed": current["wind_speed_10m"],
                "weather_code": current["weather_code"]
            }

        # Parse future forecast
        if "daily" not in weather_data:
            raise ValueError(
                f"Could not retrieve weather forecast for '{date}'."
            )

        daily = weather_data["daily"]

        return {
            "location": location["name"],
            "country": location["country"],
            "type": "forecast",
            "date": daily["time"][0],
            "temperature_max": daily["temperature_2m_max"][0],
            "temperature_min": daily["temperature_2m_min"][0],
            "feels_like_max": daily["apparent_temperature_max"][0],
            "feels_like_min": daily["apparent_temperature_min"][0],
            "precipitation_probability": daily[
                "precipitation_probability_max"
            ][0],
            "wind_speed_max": daily["wind_speed_10m_max"][0],
            "condition": WEATHER_CODES.get(
                daily["weather_code"][0],
                "Unknown"
            ),
            "weather_code": daily["weather_code"][0]
        }
        

    async def execute(self, location=None, date=None):
        if not location or not location.strip():
            location = DEFAULT_LOCATION

        location = self._geocode(location)

        return self._weather(
            location,
            date=date
        )