function SightingCard({ sighting, onLike }) {
  // Format dates nicely, exmaple : "12 de diciembre de 2025"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  //formats the createdAt date (when the sighting was submitted, ie: "12 dic 2025, 14:45")
  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        {/* Header with date and location */}
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="card-subtitle mb-1">
              <i className="fas fa-calendar-alt me-2"></i> {/* calendar icon + Avistado, ie: "icon Avistado: 7 de noviembre de 2025" */}
              Avistado: {formatDate(sighting.sightingDate)}
            </h6>
            <p className="mb-1">
              <i className="fas fa-map-marker-alt me-2"></i>    {/* location icon + region, ie: "icon Los Lagos - in a lake" */}
              <strong>{sighting.region}</strong>
              {sighting.locationName && ` - ${sighting.locationName}`}  {/* optional location name, shown only if given , ie "- in a lake" */}
            </p>
          </div>
        </div>

        {/* show photo only if it was given */}
        {sighting.photo && (
          <div className="mb-3">
            <img 
              src={sighting.photo} 
              alt="Avistamiento" 
              className="img-fluid rounded"
              style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
            />
          </div>
        )}

        {/* Show comments only if given*/}
        {sighting.comments && (
          <p className="card-text mb-2">{sighting.comments}</p>
        )}

        {/* Footer with timestamp and likes */}
        <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
          <small className="text-muted">
            Publicado: {formatTimestamp(sighting.createdAt)}  {/* ie "Publicado: 30 nov 2025, 16:18" */}
          </small>
          <button 
            className="btn btn-sm btn-outline-danger"
            onClick={() => onLike(sighting.id)}
          >
            <i className="fas fa-heart me-1"></i>  {/*heart for the like button, bootstrap is including the style of changing the arrow cursor into a hand*/}
            {sighting.likes}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SightingCard;