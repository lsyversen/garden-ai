import { db } from '../firebase-config';
import { doc, setDoc, getDocs, query, collection, where, deleteDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

/**
 * Adds a plant to the user's favorites in Firestore.
 * @param {string} userId - The ID of the logged-in user.
 * @param {string} plantName - The name of the plant to favorite.
 * @param {object} metrics - The metrics associated with the plant.
 * @param {string} pixabayImage - The image URL of the plant.
 */
export const addToFavorites = async (userId, plantName, metrics, pixabayImage) => {
  try {
    for (const [metric, value] of Object.entries(metrics)) {
      const favoriteRef = doc(db, 'favorites', `${userId}_${plantName}_${metric}`);
      await setDoc(favoriteRef, {
        userId,
        plantName,
        metric,
        value,
        pixabayImage,
        createdAt: new Date(),
      });
    }
    toast.success(`${plantName} has been added to your favorites!`);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    toast.error('There was an error adding to favorites.');
  }
};

/**
 * Removes a plant from the user's favorites in Firestore.
 * @param {string} userId - The ID of the logged-in user.
 * @param {string} plantName - The name of the plant to remove from favorites.
 */
export const removeFromFavorites = async (userId, plantName) => {
  try {
    const favoritesQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('plantName', '==', plantName)
    );
    const querySnapshot = await getDocs(favoritesQuery);

    const deletePromises = querySnapshot.docs.map((docSnapshot) =>
      deleteDoc(doc(db, 'favorites', docSnapshot.id))
    );
    await Promise.all(deletePromises);

    toast.success(`${plantName} has been removed from your favorites.`);
  } catch (error) {
    console.error('Error removing from favorites:', error);
    toast.error('There was an error removing from favorites.');
  }
};

/**
 * Checks if a plant is already favorited by the user.
 * @param {string} userId - The ID of the logged-in user.
 * @param {string} plantName - The name of the plant to check.
 * @returns {boolean} - Whether the plant is already favorited.
 */
export const isPlantFavorited = async (userId, plantName) => {
  try {
    const favoritesQuery = query(
      collection(db, 'favorites'),
      where('userId', '==', userId),
      where('plantName', '==', plantName)
    );
    const querySnapshot = await getDocs(favoritesQuery);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking favorites:', error);
    return false;
  }
};
