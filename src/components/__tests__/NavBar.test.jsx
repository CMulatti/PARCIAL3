import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from '../NavBar';

// Helper function to render NavBar with Router
const renderNavBar = () => {
  return render(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>
  );
};

describe('Componente NavBar', () => {
  
  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });

  it('debe mostrar el link "Ingresar" cuando no hay usuario autenticado', () => {
    renderNavBar();
    const linkIngresar = screen.getByText(/Ingresar/i);
    expect(linkIngresar).toBeTruthy();
  });

  it('debe mostrar "Cerrar Sesión" cuando hay usuario autenticado', () => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', 'user');
    
    renderNavBar();
    const botonCerrarSesion = screen.getByText(/Cerrar Sesión/i);
    expect(botonCerrarSesion).toBeTruthy();
  });

  it('debe mostrar el link "Admin" solo cuando el usuario es admin', () => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', 'admin');
    
    renderNavBar();
    const linkAdmin = screen.getByText(/Admin/i);
    expect(linkAdmin).toBeTruthy();
  });

  it('NO debe mostrar el link "Admin" cuando el usuario es regular', () => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', 'user');
    
    renderNavBar();
    const linkAdmin = screen.queryByText(/Admin/i);
    expect(linkAdmin).toBeNull(); // Should not exist
  });

  it('debe contener el logo y texto "Aves de Chile"', () => {
    renderNavBar();
    const textoLogo = screen.getByText(/Aves de Chile/i);
    const imagen = screen.getByAltText(/Aves de Chile logo/i);
    expect(textoLogo).toBeTruthy();
    expect(imagen).toBeTruthy();
  });

  it('debe contener el link "Inicio" siempre', () => {
    renderNavBar();
    const linksInicio = screen.getAllByText(/Inicio/i);
    expect(linksInicio.length).toBeGreaterThan(0); //we check that at least one exists
  });

  it('debe limpiar localStorage cuando se hace click en "Cerrar Sesión"', () => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', 'admin');
    
    renderNavBar();
    const botonCerrarSesion = screen.getByText(/Cerrar Sesión/i);
    
    fireEvent.click(botonCerrarSesion);
    
    expect(localStorage.getItem('isAuthenticated')).toBeNull();
    expect(localStorage.getItem('userRole')).toBeNull();
  });
});