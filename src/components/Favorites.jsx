import React, { useState, useEffect } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db, Auth } from '../firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import FavoritesPost from './FavoritesPost';
import { CircularIndeterminate } from "../loadanimation";

const Favorites = () => {
  const [favoritePlants, setFavoritePlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user] = useAuthState(Auth);

  const refetchFavoritePlants = async () => {
    setLoading(true);
    try {
      // Query to get favorites only for the logged-in user
      const favoritesQuery = query(
        collection(db, "favorites"),
        where("userId", "==", user.uid)
      );
      const data = await getDocs(favoritesQuery);

      // Group metrics by plant name for display
      const plantEntries = data.docs.reduce((acc, doc) => {
        const favorite = doc.data();
        if (!acc[favorite.plantName]) {
          acc[favorite.plantName] = { plantName: favorite.plantName, metrics: {} };
        }
        acc[favorite.plantName].metrics[favorite.metric] = favorite.value;
        return acc;
      }, {});

      setFavoritePlants(Object.values(plantEntries));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching favorite plants: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return; // If no user is logged in, skip fetching
    }

    const fetchFavoritePlants = async () => {
      setLoading(true);
      try {
        // Query to get favorites only for the logged-in user
        const favoritesQuery = query(
          collection(db, "favorites"),
          where("userId", "==", user.uid)
        );
        const data = await getDocs(favoritesQuery);

        // Group metrics by plant name for display
        const plantEntries = data.docs.reduce((acc, doc) => {
          const favorite = doc.data();
          if (!acc[favorite.plantName]) {
            acc[favorite.plantName] = { plantName: favorite.plantName, metrics: {} };
          }
          acc[favorite.plantName].metrics[favorite.metric] = favorite.value;
          return acc;
        }, {});

        setFavoritePlants(Object.values(plantEntries));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favorite plants: ", error);
        setLoading(false);
      }
    };

    fetchFavoritePlants();
  }, [user]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Favorites</h1>
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <CircularIndeterminate />
          </div>
        ) : (
          <>
            {!user || favoritePlants.length === 0 ? (
              <div className="text-center text-gray-500 text-lg">
                No favorites yet. Add plants to your favorites to see them here.
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 grid-cols-1 gap-6">
                {favoritePlants.map((plant) => (
                  <FavoritesPost
                    key={plant.plantName}
                    plantName={plant.plantName}
                    metrics={plant.metrics}
                    refetch={refetchFavoritePlants}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Favorites;

