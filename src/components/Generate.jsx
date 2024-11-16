import React, { useState } from "react";
import axios from "axios";
import GeneratedPost from "./GeneratedPost";
import { db } from "../firebase-config";
import { addDoc, collection } from "firebase/firestore";
import { CircularIndeterminate } from "../loadanimation";
import { Auth } from '../firebase-config';
import { useAuthState } from "react-firebase-hooks/auth";

const PlantSearchForm = () => {
  const [loading, setLoading] = useState(false);
  const [plantInfo, setPlantInfo] = useState(null);
  const [plantName, setPlantName] = useState("");
  const [user] = useAuthState(Auth);
  const plantRef = collection(db, "plants");

  const API_KEY = "Paste API Key Here";

  // Function to get the image path based on the metric name
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
    return metricToImageMap[metric] || "/images/logo.png"; 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const prompt = `
      You are a plant care expert. Assume you are always in Michigan. Provide detailed information for the plant "${plantName}" in JSON format. Please follow the exact JSON structure specified below and do not include any additional text, explanations, or commentary—only the JSON.

      Metric Descriptions:
      - Seed Germination Rate: Time in weeks or days.
      - Growing Zone: USDA Zone number.
      - Time to Harvest: Time in weeks or days.
      - Time to Plant: Time in weeks or days.
      - Watering Rate: Frequency (e.g., "Weekly").
      - Depth to Plant: Depth in inches or cm.
      - Seed Spacing: Depth in inches or cm.
      - Sunlight Requirements: Type (e.g., "Full sun").

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
      const response = await axios.post(
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
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      const data = JSON.parse(response.data.choices[0].message.content.trim());
      setPlantInfo(data);

      await savePlantInfo(data);

    } catch (error) {
      console.error("Error fetching plant data:", error);
      setPlantInfo({ error: "Unable to retrieve plant information at this time." });
    } finally {
      setLoading(false);
    }
  };

  // Function to save each metric in plantInfo as a separate document in Firestore
  const savePlantInfo = async (info) => {
    if (!info || !user) return;

    try {
      for (const [metric, value] of Object.entries(info)) {
        await addDoc(plantRef, {
          userId: user.uid,
          plantName: plantName,
          metric: metric,
          value: value,
          createdAt: new Date(),
        });
      }
    } catch (error) {
      console.error("Error saving plant data:", error);
      alert("Failed to save plant information.");
    }
  };

  return (
    <div className="plantSearch">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Search Plants</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Powered by the latest GPT technology!</p>
      </div>
      <form className="generate-form mt-2" onSubmit={handleSubmit}>
        <input
          type="text"
          name="plantName"
          placeholder="Enter plant name..."
          value={plantName}
          onChange={(e) => setPlantName(e.target.value)}
        />
        <button type="submit" className="button">Search</button>
      </form>
      {loading && <div className="loading"><CircularIndeterminate /></div>}
      {plantInfo && (
        <div className="plant-info">
          {Object.entries(plantInfo).map(([metric, value]) => (
            <GeneratedPost
              key={metric}
              post={{
                logo: getImageForMetric(metric), // Use the image based on metric
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
