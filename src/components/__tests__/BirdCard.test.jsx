//Does the bird card display correctly when given a bird?

import { render, screen } from '@testing-library/react';
import BirdCard from '../BirdCard';

describe('Component BirdCard', () => {
  it('debe mostrar el nombre y la imagen del ave', () => {
    const mockBird = {
      id: 1,
      name: 'Cóndor',
      image: '/condor.jpg',
      description: 'Ave grande'
    };

    //BirdCard expects a bird object (with name, desc and pic) and the onClick fucntion
    //we use an empty fucntion because we don't care what happens when clicked, we are only checking if the name and image display correctly or not.
    render(<BirdCard bird={mockBird} onClick={() => {}} />); //'render' creates a virtual version of our component for testing
    
    const nombreAve = screen.getByText(/Cóndor/i);
    const imagenAve = screen.getByRole('img');
    
    expect(nombreAve).toBeTruthy(); //check for "not null, undefined or false" it is saying "I found the text Condor!! It exists!!"
    expect(imagenAve).toHaveAttribute('src', '/condor.jpg'); //checks an attribute "Does this image have the correct source?" Checking the html
  });
});