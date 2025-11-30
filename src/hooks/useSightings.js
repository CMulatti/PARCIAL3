import { useState, useEffect } from 'react';

export function useSightings() {
  const [sightings, setSightings] = useState([]);

  //LOAD SIGHTINGS from localStorage when the hook mounts (same logic we applied in useBirds)
  //so that sightings persist even if user refreshes page
  useEffect(() => {
    const savedSightings = JSON.parse(localStorage.getItem('sightings') || '[]');
    setSightings(savedSightings);
  }, []);

  //SAVE SIGHTINGS to localStorage whenever sightings change
  //whenever setSightings() changes the array, this effect runs and the updated array is saved to localStorage as a string
  useEffect(() => {
    localStorage.setItem('sightings', JSON.stringify(sightings));
  }, [sightings]);

  //ADD NEW SIGHTING
  const addSighting = (newSighting) => {
    const sightingWithMetadata = {
      ...newSighting,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      likes: 0,
      likedBy: [] // Track who liked it 
    };
    setSightings([sightingWithMetadata, ...sightings]); // Prepend so that new sightings appear first --> setSightings([newObject, ...oldSightings])
  };

  // TOGGLE LIKE ON A SIGHTING (this happens every time the like heart is clicked)
  //  React receives the ID of the sighting that was liked (sightingId)
  // React creates a new list by going through every item of the old sightings array one by one
  // For each item, if the id matches the id of the one the user liked, React makes a new copy of that object but with likes+1
  // If the IDs do not match, React keeps the object as it is
  // When the loop .map() finishes, we end up with a new list with all sightings unchanged except for one whose like count increased by one,
  // We send that new list to setSightings to update React's state
  // Because state changed, React rerenders the screen, now showing the updated number of likes
  const toggleLike = (sightingId) => {
    setSightings(sightings.map(sighting => {
      if (sighting.id === sightingId) {
        return {
          ...sighting,
          likes: sighting.likes + 1
        };
      }
      return sighting;
    }));
  };

  //GET SIGHTINGS FOR A SPECIFIC BIRD
  //.filter() returns a new array containing only the sightings that belong to that bird
  // It does not save this new list into a state (we don't want to change the list, we just want to read from it and keep only certain items),
  //  it just returns the new list to the component that asked for it
  const getSightingsForBird = (birdId) => {
    return sightings.filter(s => s.birdId === Number(birdId));
  };

  return { 
    sightings, 
    addSighting, 
    toggleLike, 
    getSightingsForBird 
  };
}