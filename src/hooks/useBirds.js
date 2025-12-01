import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8082/api/birds';

export function useBirds() {
  const [birds, setBirds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load birds from Spring backend on mount
  useEffect(() => {
    const fetchBirds = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch birds');
        const data = await response.json();
        
        // When FETCHING birds (GET) , Map birdId from backend to id for React components
        const mappedData = data.map(bird => ({
          ...bird,
          id: bird.birdId // React components expect 'id', database has 'birdId'
        }));
        
        setBirds(mappedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching birds:', error);
        setError('No se pudieron cargar las aves. Verifica que el servidor esté corriendo.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBirds();
  }, []);

  // Add a new bird
  const addBird = async (newBird) => {
    try {
      // Prepare bird data for backend
      const birdData = {
        name: newBird.name,
        scientificname: newBird.scientificname || 'Sin nombre científico', // Add default if missing
        description: newBird.description,
        image: newBird.image // This should be a URL, not base64
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(birdData)
      });
      
      if (!response.ok) throw new Error('Failed to add bird');
      
      const savedBird = await response.json();
      
      // Map birdId to id for consistency
      const mappedBird = {
        ...savedBird,
        id: savedBird.birdId
      };
      
      setBirds([...birds, mappedBird]);
      return mappedBird; // Return the saved bird
    } catch (error) {
      console.error('Error adding bird:', error);
      throw error; // Re-throw so BirdForm can handle it
    }
  };

  // Update bird
  const updateBird = async (id, updatedBird) => {
    try {
      // Prepare bird data for backend
      const birdData = {
        name: updatedBird.name,
        scientificname: updatedBird.scientificname,
        description: updatedBird.description,
        image: updatedBird.image
      };

      const response = await fetch(`${API_URL}/${id}`, {  // ✅ FIXED: Added parentheses
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(birdData)
      });
      
      if (!response.ok) throw new Error('Failed to update bird');
      
      const savedBird = await response.json();
      
      // Map birdId to id
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

  // Delete bird
  const deleteBird = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {  // ✅ FIXED: Added parentheses
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete bird');
      
      setBirds(birds.filter(bird => bird.id !== id));
    } catch (error) {
      console.error('Error deleting bird:', error);
      throw error;
    }
  };

  return { birds, addBird, updateBird, deleteBird, loading, error };
}