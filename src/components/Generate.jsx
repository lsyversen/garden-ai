import React, { useState, useEffect } from "react";
import axios from "axios";
import GeneratedPost from "./GeneratedPost";
import { db } from "../firebase-config";
import { addDoc, collection } from "firebase/firestore";
import { CircularIndeterminate } from "../loadanimation";
import { Auth } from '../firebase-config';
import { useAuthState } from "react-firebase-hooks/auth";
import { FaHeart } from 'react-icons/fa';
import { addToFavorites, removeFromFavorites, isPlantFavorited } from '../utils/favorites';
import { Toaster } from 'react-hot-toast';

const getImageForMetric = (metric) => {
  const metricToImageMap = {
    "Seed Germination Rate": "/images/SeedGerminationRate.png",
    "Growing Zone": "/images/GrowingZone.png",
    "Time to Harvest": "/images/TimeToHarvest.png",
    "Watering Rate": "/images/WateringRate.png",
    "Depth to Plant": "/images/DepthToPlant.png",
    "Sunlight Requirements": "/images/SunlightRequirements.png",
    "Seed Spacing": "/images/SeedSpacing.png",
    "Time to Plant": "/images/TimeToHarvestTwo.png",
  };
  return metricToImageMap[metric] || "/images/default.png";
};

const PlantSearchForm = () => {
  const [loading, setLoading] = useState(false);
  const [plantInfo, setPlantInfo] = useState(null);
  const [plantName, setPlantName] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [user] = useAuthState(Auth);
  const plantRef = collection(db, "plants");
  const [isFavorited, setIsFavorited] = useState(false);

  const cache = {}; // In-memory cache for Pixabay API

  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  const PIXABAY_API_KEY = process.env.REACT_APP_PIXABAY_API_KEY;  

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && plantName) {
        const favorited = await isPlantFavorited(user.uid, plantName);
        setIsFavorited(favorited);
      }
    };

    checkFavoriteStatus();
  }, [user, plantName]);

  const handleAddToFavorites = async () => {
    if (user) {
      await addToFavorites(user.uid, plantName, plantInfo, imageUrl);
      setIsFavorited(true);
    }
  };

  const handleRemoveFromFavorites = async () => {
    if (user) {
      await removeFromFavorites(user.uid, plantName);
      setIsFavorited(false);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      alert("Please log in to manage favorites.");
      return;
    }

    if (isFavorited) {
      await handleRemoveFromFavorites();
    } else {
      await handleAddToFavorites();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation: Check if plant name is empty
    if (!plantName.trim()) {
      setPlantInfo({ error: "Please enter a plant name to complete the search." });
      return;
    }

    setLoading(true);
    setImageUrl(null);

    const prompt = `
      You are a plant care expert. Assume you are always in Michigan. Provide detailed information for the plant "${plantName}" in JSON format. Please follow the exact JSON structure specified below and do not include any additional text, explanations, or commentary—only the JSON.
      
      JSON format:
      {
          "Seed Germination Rate": "Rate in weeks or days",
          "Growing Zone": "USDA Zone number",
          "Time to Harvest": "Time in weeks or days",
          "Time to Plant": "Time in weeks or days",
          "Watering Rate": "Frequency",
          "Depth to Plant": "Depth in inches or cm",
          "Seed Spacing": "Depth in inches or cm",
          "Sunlight Requirements": "Type"
      }
    `;

    try {
      const openAiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            { role: "system", content: "You are a helpful plant care expert." },
            { role: "user", content: prompt }
          ],
          max_tokens: 150,
          temperature: 0.5,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const data = JSON.parse(openAiResponse.data.choices[0].message.content.trim());
      setPlantInfo(data);

      if (cache[plantName]) {
        setImageUrl(cache[plantName]);
      } else {
        const pixabayResponse = await axios.get("https://pixabay.com/api/", {
          params: {
            key: PIXABAY_API_KEY,
            q: plantName,
            image_type: "photo",
            safesearch: "true",
          },
        });

        const pixabayImage = pixabayResponse.data.hits.length > 0
          ? pixabayResponse.data.hits[0].webformatURL
          : null;

        cache[plantName] = pixabayImage;
        setImageUrl(pixabayImage);
      }

      if (user) {
        for (const [metric, value] of Object.entries(data)) {
          await addDoc(plantRef, {
            userId: user.uid,
            plantName,
            metric,
            value,
            imageUrl: cache[plantName],
            createdAt: new Date(),
          });
        }
      }
    } catch (error) {
      console.error("Error fetching plant data or image:", error);
      setPlantInfo({ error: "Unable to retrieve plant information or image at this time." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plantSearch">
      <Toaster position="top-right" reverseOrder={false} />
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Search Plants</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Powered by latest GPT technology!</p>
      </div>
      <form className="generate-form mt-2" onSubmit={handleSubmit}>
        <input
          type="text"
          name="plantName"
          placeholder="Enter plant name..."
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button type="submit" className="button mt-2 bg-green-500 text-white py-2 px-4 rounded">Search</button>
      </form>
      {loading && <div className="loading"><CircularIndeterminate /></div>}
      {plantInfo && plantInfo.error && (
        <p className="error-message text-red-500 mt-2">{plantInfo.error}</p>
      )}
      {imageUrl && (
        <div className="flex justify-center items-center mt-6">
          <img
            src={imageUrl}
            alt={plantName}
            className="w-80 h-auto object-cover rounded-lg shadow-md"
          />
          <div className="ml-4 flex flex-col items-center space-y-2">
            <button
              onClick={toggleFavorite}
              className={`p-2 ${isFavorited ? "text-red-500" : "text-gray-400"} hover:scale-110 transition-transform`}
            >
              <FaHeart size={24} />
            </button>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(plantName)}+buy+now`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-green-600"
            >
              Buy Now
            </a>
            <p className="text-gray-400 text-xs mt-1">
              Images provided by <a href="https://pixabay.com" target="_blank" rel="noopener noreferrer" className="text-blue-400">Pixabay</a>
            </p>
          </div>
        </div>
      )}
      {plantInfo && !plantInfo.error && (
        <div className="plant-info mt-6">
          {Object.entries(plantInfo).map(([metric, value]) => (
            <GeneratedPost
              key={metric}
              post={{
                logo: getImageForMetric(metric),
                response: value,
                prompt: metric,
                user: user ? user.displayName : "Anonymous",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlantSearchForm;