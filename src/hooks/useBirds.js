//This is a custom hook that centralises bird state and persistence logic

import { useState, useEffect } from 'react';

export function useBirds() {
  const [birds, setBirds] = useState([]); //state to hold the array of bird objects

  // Load birds from localStorage when the hook mounts
  useEffect(() => {
    const savedBirds = JSON.parse(localStorage.getItem('birds') || '[]');
    setBirds(savedBirds);
  }, []); //[]empty dependency, runs once, on mount

  //Save birds to localStorage whenever 'birds' changes
  useEffect(() => {
    localStorage.setItem('birds', JSON.stringify(birds));
  }, [birds]);  //[birds] runs every time 'birds' changes

  //function to add new bird to the array
  const addBird = (newBird) => {
    const birdWithId = {
      ...newBird,
      id: Date.now()
    };
    setBirds([...birds, birdWithId]); //append new bird to the existing birds array
  };

  //function to update
  const updateBird = (id, updatedBird) => {
    setBirds(birds.map(bird => 
      bird.id === id ? { ...bird, ...updatedBird } : bird
    ));
  };
  
  //function to delete
  const deleteBird = (id) => {
    setBirds(birds.filter(bird => bird.id !== id));
  };


// expose birds and functions to whoever uses the hook
  return { birds, addBird, updateBird, deleteBird };
}