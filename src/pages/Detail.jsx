
import { useParams, useNavigate } from 'react-router-dom'

function Detail({ birds }) {
  const { birdId } = useParams() // Get bird ID from URL
  const navigate = useNavigate()
  
  // Find the bird by ID
  const bird = birds.find(b => b.id === Number(birdId))
  
  const handleBack = () => {
    navigate('/') // Go back to home
  }
  
  // If bird not found, show error message
  if (!bird) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Ave no encontrada
        </div>
        <button className="btn btn-secondary" onClick={handleBack}>
          Volver al inicio
        </button>
      </div>
    )
  }
  
  return (
    <div className="container mt-5 detail-page">
      <button className="btn btn-secondary mb-4" onClick={handleBack}>
        Volver
      </button>
      <div className="row">
        <div className="col-md-6">
          <img src={bird.image} alt={bird.name} className="img-fluid rounded" />
        </div>
        <div className="col-md-6">
          <h1>{bird.name}</h1>
          <p className="lead">{bird.description}</p>
        </div>
      </div>
    </div>
  )
}

export default Detail