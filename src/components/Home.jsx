import React, { useState, useEffect } from 'react';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db, Auth } from '../firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';
import CompletedPost from './CompletedPost';
import { CircularIndeterminate } from "../loadanimation";

const Home = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText] = useState('');
  const [searchedResults] = useState(null);
  const [user] = useAuthState(Auth);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return; // If no user is logged in, skip fetching
    }

    setLoading(true);
    const fetchPlants = async () => {
      try {
        // Query to get plants only for the logged-in user
        const plantsQuery = query(collection(db, "plants"), where("userId", "==", user.uid));
        const data = await getDocs(plantsQuery);

        // Group plants by plantName and organize metrics
        const plantEntries = data.docs.reduce((acc, doc) => {
          const plant = doc.data();
          const plantName = plant.plantName;
          if (!acc[plantName]) {
            acc[plantName] = { plantName, metrics: {}, imageUrl: plant.imageUrl };
          }
          acc[plantName].metrics[plant.metric] = plant.value;
          return acc;
        }, {});

        setPlants(Object.values(plantEntries));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching plants data: ", error);
        setLoading(false);
      }
    };

    fetchPlants();
  }, [user]);

  return (
    <section className="max-w-7xl mx-auto px-4">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">History</h1>
      </div>

      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <CircularIndeterminate />
          </div>
        ) : (
          <>
            {!user || plants.length === 0 ? (
              <div className="text-center text-gray-500 text-lg">
                This is where your searches will appear
              </div>
            ) : (
              <>
                {searchText && (
                  <h2 className="font-medium text-[#666e75] text-xl mb-3">
                    Showing Results for <span className="text-[#222328]">{searchText}</span>:
                  </h2>
                )}
                <div className="grid lg:grid-cols-2 sm:grid-cols-2 xs:grid-cols-1 grid-cols-1 gap-6">
                  {searchText && searchedResults ? (
                    searchedResults.map((plant) => (
                      <CompletedPost
                        key={plant.plantName}
                        plantName={plant.plantName}
                        metrics={plant.metrics}
                        pixabayImage={plant.imageUrl}
                      />
                    ))
                  ) : (
                    plants.map((plant) => (
                      <CompletedPost
                        key={plant.plantName}
                        plantName={plant.plantName}
                        metrics={plant.metrics}
                        pixabayImage={plant.imageUrl}
                      />
                    ))
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Home;
