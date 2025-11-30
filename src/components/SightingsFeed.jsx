import { useNavigate } from 'react-router-dom';
import SightingForm from './SightingForm';
import SightingCard from './SightingCard';

function SightingsFeed({ birdId, sightings, onAddSighting, onLike }) {
  const navigate = useNavigate(); //used to redirect to login if user wants to add a sighting
  
  // Check if user is logged in
  const isAuthenticated = localStorage.getItem('isAuthenticated'); 

  const handleLoginClick = () => {
    navigate('/login');
  };



  return (
    <div className="p-3 mb-4 bg-secondary-subtle rounded shadow-sm">
      <h3 className="m-0 fw-bold text-center"> <i className="fas fa-binoculars me-2 text-primary"></i>
      <span className="text-primary">Avistamientos de la comunidad</span></h3>

      {/* SIGHTINGS LIST*/}
      {/* Summary: There are X sightings OR None yet */}
      <div className="mt-4">
        <h5 className="mb-3">
          {sightings.length > 0 
            ? `${sightings.length} avistamiento${sightings.length !== 1 ? 's' : ''} registrado${sightings.length !== 1 ? 's' : ''}`
            : 'Aún no hay avistamientos registrados'}
        </h5>
        
        {/* Content: "empty layout" OR "Here are the Cards"*/}
        {sightings.length === 0 ? (
          <div className="text-center text-muted py-5">
            <i className="fas fa-search fa-3x mb-3"></i>
            <p>Sé el primero en registrar un avistamiento de esta ave.</p>
          </div>
        ) : (
          <div>
            {sightings.map(sighting => (
              <SightingCard 
                key={sighting.id} 
                sighting={sighting}
                onLike={onLike}
              />
            ))}
          </div>
        )}
      </div>

      {/* SIGHTING FORM OR LOGIN CALL-TO-ACTION */}
      {isAuthenticated ? (
        <>
          <div className="alert alert-info mb-4 d-flex align-items-center justify-content-center">
            <i className="fas fa-binoculars me-2 fa-lg"></i>
            <h5 className="m-0"><strong>Has visto esta ave? Registra tu avistamiento</strong></h5>
          </div>
          <SightingForm birdId={birdId} onAddSighting={onAddSighting} />
        </>
      ) : (
        <div className="alert alert-warning mb-4">
          <i className="fas fa-info-circle me-2"></i>
          ¿Has visto esta ave? 
          <button 
            className="btn btn-sm btn-primary ms-2"
            onClick={handleLoginClick}
          >
            Inicia sesión
          </button>
          {' '}para registrar tu avistamiento.
        </div>
      )}



    </div>
  );
}

export default SightingsFeed;