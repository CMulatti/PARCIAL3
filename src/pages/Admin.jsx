import BirdForm from '../components/BirdForm.jsx'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'


function Admin({ birds, onAddBird, onUpdateBird, onDeleteBird }) {
  const navigate = useNavigate()
  const [editingBird, setEditingBird] = useState(null) //editingBird=null --> we are creating a new bird ; editingBird= some bird --> we are editing
  const handleBackToHome = () => {
    navigate('/')
  }

  const handleSelectBird = (bird) => {
    setEditingBird(bird)                       //“This is the currently selected bird that we want to edit" (the data for it will get loaded in BirdForm.jsx once we pass editingBird to it as a prop)
  }
  
  const handleCancelEdit = () => {
    setEditingBird(null) // Go back to "create new bird" mode
  }



  return (
    <div className="container mt-5 mb-5">
      <h1 className="mb-4">Bienvenido Administrador</h1>
      
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">
                {editingBird ? 'Editar Ave' : 'Creador de aves'}
              </h2>
              
              {/* Pass the editing bird to the form */}
              <BirdForm 
                onAddBird={onAddBird}
                onUpdateBird={onUpdateBird}
                onDeleteBird={onDeleteBird}
                editingBird={editingBird}
                onCancelEdit={handleCancelEdit}
              />
            </div>
          </div>
          
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">Administrador de usuarios</h2>
              <p className="text-muted">Próximamente...</p>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Moderar avistamientos</h2>
              <p className="text-muted">Próximamente...</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card mb-3">
            <div className="card-body">
              <h5>Aves registradas: {birds.length}</h5>
              <button 
                className="btn btn-primary w-100 mt-3" 
                onClick={handleBackToHome}
              >
                Ir a página principal
              </button>
            </div>
          </div>
          
          {/*ADMIN LIST OF CREATED BIRDS */}
          {/*line 84: .map() loops through every bird in the array and returns a <button> element for each one. Each of these has:
          A unique key (lists need keys in React), A dynamic class to highlight the button, and a click handler which once clicked, 
          makes the bird become the editingBird in state.*/}
          {/*"line 87: className should start with 'list-group-item list-group-item-action'
          then add 'active' to make it appear highlighted, but only if the clicked bird (editingBird) is the same as this list item from the .map()"*/}
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Lista de aves</h5>
              {birds.length === 0 ? (
                <p className="text-muted">No hay aves registradas</p>
              ) : (
                <div className="list-group">
                  {birds.map(bird => (
                    <button
                      key={bird.id}
                      className={`list-group-item list-group-item-action ${editingBird?.id === bird.id ? 'active' : ''}`}
                      onClick={() => handleSelectBird(bird)}
                    >
                      {bird.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Admin;