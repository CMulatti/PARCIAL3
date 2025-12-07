import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8082/api/birds';

//Helper to get headers with token. GET is public doesn't need token, we want the token only when needed and this function does that
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); //logging in generates a token that gets saved in localStorage, here we are reading that token. Not logged in is null
  const headers = { 'Content-Type': 'application/json' }; //every Json request needs this header. Tells the server "I'm sending JSON in the body"
  //only add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export function useBirds() {
  const [birds, setBirds] = useState([]); //the birds
  const [loading, setLoading] = useState(true); //shows if backend response is still in progress
  const [error, setError] = useState(null); //shows when the backend fails

  //LOAD BIRDS - NO TOKEN NEEDED (public)
  useEffect(() => {
    const fetchBirds = async () => {
      try {
        setLoading(true); //start loading spinner
        const response = await fetch(API_URL); // No auth needed for GET, ask backend for birds
        if (!response.ok) throw new Error('Failed to fetch birds'); //check server reply
        const data = await response.json(); //convert JSON string to JS array
        
        const mappedData = data.map(bird => ({
          ...bird,
          id: bird.birdId //backend sends birdId, React prefers id, so we convert it. This way, UI doesn't need to care what the backend calls things
        }));
        
        setBirds(mappedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching birds:', error);
        setError('No se pudieron cargar las aves.'); //if server fails, or connection fails or API is wrong
      } finally {
        setLoading(false); //stop loading spinner (this runs regardless of success or error)
      }
    };
    
    fetchBirds();
  }, []);

  // Add bird - POST, TOKEN REQUIRED (admin only)
  const addBird = async (newBird) => {
    try {
      const birdData = {    //build bird data
        name: newBird.name,
        scientificname: newBird.scientificname,
        description: newBird.description,
        image: newBird.image
      };

      //POST to backend, await
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(), // Includes token
        body: JSON.stringify(birdData)
      });
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('No tienes permiso para realizar esta acción');
      }
      
      if (!response.ok) throw new Error('Failed to add bird');
      
      const savedBird = await response.json(); //backend returns savedBird
      const mappedBird = {   //map savedBird to frontend format
        ...savedBird,
        id: savedBird.birdId
      };
      
      setBirds([...birds, mappedBird]);
      return mappedBird;  //return mappedBird to whoever called addBird()
    } catch (error) {
      console.error('Error adding bird:', error);
      throw error;
    }
  };

  // Update bird - PUT, TOKEN REQUIRED (admin only)
  const updateBird = async (id, updatedBird) => {
    try {
      const birdData = {
        name: updatedBird.name,
        scientificname: updatedBird.scientificname,
        description: updatedBird.description,
        image: updatedBird.image
      };

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(), // Includes token
        body: JSON.stringify(birdData)
      });
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('No tienes permiso para realizar esta acción');
      }
      
      if (!response.ok) throw new Error('Failed to update bird');
      
      const savedBird = await response.json();
      const mappedBird = {
        ...savedBird,
        id: savedBird.birdId
      };
      
      setBirds(birds.map(bird => bird.id === id ? mappedBird : bird));
      return mappedBird;
    } catch (error) {
      console.error('Error updating bird:', error);
      throw error;
    }
  };

  // Delete bird -TOKEN REQUIRED (admin only)
  const deleteBird = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders() // Includes token
      });
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('No tienes permiso para realizar esta acción');
      }
      
      if (!response.ok) throw new Error('Failed to delete bird');
      
      setBirds(birds.filter(bird => bird.id !== id));  //go through every bird, keep only those whose id is NOT the one we deleted
    } catch (error) {
      console.error('Error deleting bird:', error);
      throw error;
    }
  };

  return { birds, addBird, updateBird, deleteBird, loading, error };
}