import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8082/api/birds';

// Helper to get headers with token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export function useBirds() {
  const [birds, setBirds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load birds - NO TOKEN NEEDED (public)
  useEffect(() => {
    const fetchBirds = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL); // No auth needed for GET
        if (!response.ok) throw new Error('Failed to fetch birds');
        const data = await response.json();
        
        const mappedData = data.map(bird => ({
          ...bird,
          id: bird.birdId
        }));
        
        setBirds(mappedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching birds:', error);
        setError('No se pudieron cargar las aves.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBirds();
  }, []);

  // Add bird - TOKEN REQUIRED (admin only)
  const addBird = async (newBird) => {
    try {
      const birdData = {
        name: newBird.name,
        scientificname: newBird.scientificname,
        description: newBird.description,
        image: newBird.image
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(), // Includes token
        body: JSON.stringify(birdData)
      });
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('No tienes permiso para realizar esta acción');
      }
      
      if (!response.ok) throw new Error('Failed to add bird');
      
      const savedBird = await response.json();
      const mappedBird = {
        ...savedBird,
        id: savedBird.birdId
      };
      
      setBirds([...birds, mappedBird]);
      return mappedBird;
    } catch (error) {
      console.error('Error adding bird:', error);
      throw error;
    }
  };

  // Update bird - TOKEN REQUIRED (admin only)
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
      
      setBirds(birds.filter(bird => bird.id !== id));
    } catch (error) {
      console.error('Error deleting bird:', error);
      throw error;
    }
  };

  return { birds, addBird, updateBird, deleteBird, loading, error };
}