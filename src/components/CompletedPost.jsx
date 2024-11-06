import React from 'react';
import MetricPost from './MetricPost';

const getImageForMetric = (metric) => {
  const metricToImageMap = {
    "Seed Germination Rate": "/images/SeedGerminationRate.png",
    "Growing Zone": "/images/GrowingZone.png",
    "Time to Harvest": "/images/TimeToHarvest.png",
    "Watering Rate": "/images/WateringRate.png",
    "Depth to Plant": "/images/DepthToPlant.png",
    "Sunlight Requirements": "/images/SunlightRequirements.png",
  };
  return metricToImageMap[metric] || "/images/default.png"; // Use a default image if metric not found
};

const CompletedPost = ({ plantName, metrics }) => {
  return (
    <div className="completed-post rounded-xl shadow-card hover:shadow-cardhover p-4 bg-white mb-4">
      <div className="header flex items-center mb-4">
        <img src="/images/logo.png" alt="Plant Logo" className="w-12 h-12 object-cover rounded-full mr-4" />
        <h2 className="text-xl font-semibold text-gray-800">{plantName}</h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(metrics).map(([metric, value]) => (
          <MetricPost
            key={metric}
            post={{
              logo: getImageForMetric(metric),
              response: value,
              prompt: metric,
              user: "", // Leave blank as user info isn't necessary here
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CompletedPost;
