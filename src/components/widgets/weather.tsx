"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cloud, Sun, CloudRain, Snowflake } from "lucide-react";
import { CardTitle } from "../ui/card";
import { IconHaze } from "@tabler/icons-react";

type WeatherData = {
  temperature: number;
  condition: string;
  icon: string;
};

const API_KEYS = {
  weatherapi: "YOUR_WEATHER_API_KEY",
};

export function Weather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState("");
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(
            `${position.coords.latitude},${position.coords.longitude}`
          );
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  });

  const fetchWeather = async (query: string) => {
    const url: string = `https://api.weatherapi.com/v1/current.json?key=${API_KEYS.weatherapi}&q=${query}&aqi=no`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const weatherData = {
        temperature:
          unit === "celsius"
            ? Math.round(data.current.temp_c)
            : Math.round(data.current.temp_f),
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
      };
      setWeatherData(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location) {
      fetchWeather(location);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "clear":
      case "sunny":
        return <Sun className="w-16 h-16" />;
      case "clouds":
      case "cloudy":
      case "partly cloudy":
        return <Cloud className="w-16 h-16" />;
      case "rain":
      case "drizzle":
      case "showers":
        return <CloudRain className="w-16 h-16" />;
      case "snow":
        return <Snowflake className="w-16 h-16" />;
      default:
        return <Cloud className="w-16 h-16" />;
    }
  };

  return (
    <div>
      <CardTitle className="text-2xl font-bold mb-4 flex gap-2">
        <IconHaze />
        Weather
      </CardTitle>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            className="flex-grow"
          />
          <Button type="submit">Search</Button>
        </div>
      </form>
      {weatherData && (
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">
            {weatherData.temperature}°{unit === "celsius" ? "C" : "F"}
          </div>
          <div className="text-2xl mb-4">{weatherData.condition}</div>
          <div className="flex justify-center mb-4">
            {getWeatherIcon(weatherData.condition)}
          </div>
        </div>
      )}
      <div className="flex justify-between gap-2">
        <Select
          value={unit}
          onValueChange={(value: "celsius" | "fahrenheit") => setUnit(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Temperature unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="celsius">Celsius</SelectItem>
            <SelectItem value="fahrenheit">Fahrenheit</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
