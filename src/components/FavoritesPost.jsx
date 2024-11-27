import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Auth } from '../firebase-config';
import { FaHeart } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { addToFavorites, removeFromFavorites, isPlantFavorited } from '../utils/favorites';
import MetricPost from './MetricPost';

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

const FavoritesPost = ({ plantName, metrics, pixabayImage, refetch }) => {
  const [user] = useAuthState(Auth);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user) {
        const favorited = await isPlantFavorited(user.uid, plantName);
        setIsFavorited(favorited);
      }
    };

    checkFavoriteStatus();
  }, [user, plantName]);

  const toggleFavorite = async () => {
    if (!user) {
      toast('Please log in to manage favorites.');
      return;
    }

    if (isFavorited) {
      await removeFromFavorites(user.uid, plantName);
      refetch(); // Refresh the favorites list after removing
    } else {
      await addToFavorites(user.uid, plantName, metrics, pixabayImage);
    }
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="completed-post rounded-xl shadow-md hover:shadow-lg p-4 bg-white mb-4">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="header flex items-center justify-between mb-4">
        <div className="flex items-center">
          {pixabayImage && (
            <img
              src={pixabayImage}
              alt={plantName}
              className="object-cover rounded-lg mr-4"
              style={{ width: '85px', height: '85px' }}
            />
          )}
          <h2 className="text-xl font-semibold text-gray-800">{plantName}</h2>
        </div>
        <div className="flex items-center">
          <button
            onClick={toggleFavorite}
            className={`mr-2 ${isFavorited ? 'text-red-500' : 'text-gray-400'} focus:outline-none`}
            aria-label="Add to Favorites"
          >
            <FaHeart size={24} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(metrics).map(([metric, value]) => (
          <MetricPost
            key={metric}
            post={{
              logo: getImageForMetric(metric),
              response: value,
              prompt: metric,
              user: '',
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPost;



