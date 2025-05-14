"use client";
import React, { useState } from "react";
import Input from "./component/Input";
import Current from "./component/Current";
import WeatherDetails from "./component/WeatherDetails";
import WeekForecast from "./component/WeekForecast";

interface WeatherData {
  current: {
    condition: {
      icon: string;
      text: string;
    };
    temp_f: number;
    wind_mph: number;
    humidity: number;
    wind_dir: string;
    pressure_mb: number;
    feelslike_f: number;
    vis_km: number;
  };
  location: {
    name: string;
    region: string;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        condition: {
          icon: string;
          text: string;
        };
        maxtemp_f: number;
        mintemp_f: number;
      };
      astro: {
        sunrise: string;
        sunset: string;
      };
    }>;
  };
}

const Home = () => {
  const [data, setData] = useState<WeatherData | {}>({});
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const url = `http://api.weatherapi.com/v1/forecast.json?key=c69178b258424dad971192655251105&q=${location}&days=7&aqi=yes&alerts=yes`;
  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      try {
        const responce = await fetch(url);
        if (!responce.ok) {
          throw new Error();
        }
        const data = await responce.json();
        setData(data);
        setLocation("");
        setError("");
      } catch (error) {
        setError("City not found");
        setData({});
      }
    }
  };

  let content;
  if (Object.keys(data).length === 0 && error === "") {
    content = (
      <div className="text-white text-center h-screen mt-[5rem]">
        <h2 className="text-3xl font-bold mb-4">Welcome to weather app</h2>
        <p className="text-xl">Enter a city name to get the weather forecast</p>
      </div>
    );
  } else if (error !== "") {
    content = (
      <div className="text-white text-center h-screen mt-[5rem]">
        <p className="text-3xl font-bold mb-4">City NOT F.</p>
        <p className="text-xl ">Enter a V. City</p>
      </div>
    );
  } else {
    content = (
      <>
        <div className="flex md:flex-row flex-col p-12 items-center justify-between">
          <Current data={data as WeatherData} />
          <WeekForecast data={data as WeatherData} />
        </div>
        <div>
          <WeatherDetails data={data as WeatherData} />
        </div>
      </>
    );
  }
  return (
    <div className="bg-cover bg-gradient-to-r from-blue-500 to-blue-300 h-fit">
      <div className="bg-white/25 w-full flex flex-col h-full">
        {/* INPUT AND LOGO */}
        <div className="flex flex-col justify-between items-center p-12">
          <Input handleSearch={handleSearch} setLocation={setLocation} />
          <h1 className="text-3xl font-bold text-white">Weather App</h1>
        </div>
        {content}
      </div>
    </div>
  );
};

export default Home;
