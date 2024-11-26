import React, { useState, useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Auth, db } from '../firebase-config';
import { doc, setDoc, getDocs, collection, query, where, deleteDoc } from 'firebase/firestore';
import MetricPost from './MetricPost';
import { FaHeart } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

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

const CompletedPost = ({ plantName, metrics, pixabayImage }) => {
  const [user] = useAuthState(Auth);
  const [isFavorited, setIsFavorited] = useState(false);
  const hasMounted = useRef(false);

  useEffect(() => {
    hasMounted.current = true;

    const checkIfFavorited = async () => {
      if (user) {
        try {
          const favoritesQuery = query(
            collection(db, 'favorites'),
            where('userId', '==', user.uid),
            where('plantName', '==', plantName)
          );
          const querySnapshot = await getDocs(favoritesQuery);
          if (!querySnapshot.empty) {
            setIsFavorited(true);
          }
        } catch (error) {
          console.error("Error checking favorites:", error);
        }
      }
    };
    checkIfFavorited();

    return () => {
      hasMounted.current = false;
    };
  }, [user, plantName]);

  const handleAddToFavorites = async () => {
    if (user && hasMounted.current) {
      try {
        for (const [metric, value] of Object.entries(metrics)) {
          const favoriteRef = doc(db, 'favorites', `${user.uid}_${plantName}_${metric}`);
          await setDoc(favoriteRef, {
            userId: user.uid,
            plantName: plantName,
            metric: metric,
            value: value,
            pixabayImage: pixabayImage,
            createdAt: new Date(),
          });
        }
        setIsFavorited(true);
        toast.success(`${plantName} has been added to your favorites!`);
      } catch (error) {
        console.error("Error adding to favorites:", error);
        toast.error("There was an error adding to favorites.");
      }
    } else {
      toast('Please log in to add favorites.');
    }
  };

  const handleRemoveFromFavorites = async () => {
    if (user && hasMounted.current) {
      try {
        const favoritesQuery = query(
          collection(db, 'favorites'),
          where('userId', '==', user.uid),
          where('plantName', '==', plantName)
        );
        const querySnapshot = await getDocs(favoritesQuery);

        const deletePromises = querySnapshot.docs.map((docSnapshot) =>
          deleteDoc(doc(db, 'favorites', docSnapshot.id))
        );
        await Promise.all(deletePromises);

        setIsFavorited(false);
        toast.success(`${plantName} has been removed from your favorites.`);
      } catch (error) {
        console.error("Error removing from favorites:", error);
        toast.error("There was an error removing from favorites.");
      }
    }
  };

  const toggleFavorite = async () => {
    if (isFavorited) {
      await handleRemoveFromFavorites();
    } else {
      await handleAddToFavorites();
    }
  };

  return (
    <div className="completed-post rounded-xl shadow-md hover:shadow-lg p-4 bg-white mb-4">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="header flex items-center justify-between mb-4">
        <div className="flex items-center">
          {/* Pixabay Image */}
          <img
            src={pixabayImage}
            alt={plantName}
            className="object-cover rounded-lg mr-4"
            style={{ width: "85px", height: "85px" }}
          />
          <h2 className="text-xl font-semibold text-gray-800">{plantName}</h2>
        </div>
        <div className="flex items-center">
          {/* Buy Now Button */}
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(plantName)}+buy+now`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 text-white py-1 px-3 rounded-lg text-sm hover:bg-green-600 mr-2"
          >
            Buy Now
          </a>
          {/* Favorite Button */}
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
              user: "",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default CompletedPost;
