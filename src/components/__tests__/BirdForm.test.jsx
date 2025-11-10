//Does the form show an error if we submit it without a name?

import { render, screen, fireEvent } from '@testing-library/react';
import BirdForm from '../BirdForm';

describe('Componente BirdForm', () => {
  it('debe mostrar error cuando se envía el formulario sin nombre', () => {
    render(<BirdForm onAddBird={() => {}} />); //again empty fucntion, bc we don't care what happens when bird is added, we just need it not to crash
    
    const boton = screen.getByRole('button', { name: /Guardar Ave/i }); //add "i" to make it case insensitive, our button Guardar Ave is hardcoded, but what if someone changed it in the future? It's considered good practice to add this "i"
    fireEvent.click(boton);
    
    const mensajeError = screen.getByText(/Por favor ingresa el nombre del ave/i); //looks for this text, if found, then the validation worked
  });
});