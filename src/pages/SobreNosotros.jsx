import { useNavigate } from 'react-router-dom'

function SobreNosotros() {
  const navigate = useNavigate()

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-4" onClick={() => navigate('/')}>
      Volver al Inicio
      </button>
      
      <header className="text-center mb-5">
        <h1 className="display-4">Sobre Nosotros</h1>
        <p className="lead text-muted">
          Conoce más sobre Aves de Chile
        </p>
      </header>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h3>Nuestra Misión</h3>
          <p>
            Aves de Chile es una plataforma dedicada a promover el conocimiento 
            y la conservación de las aves nativas de Chile. 
            En nuestro sitio podrás aprender sobre las aves nativas de forma didactica, 
            registrar y compartir tus avistamientos con la comunidad!
          </p>

          <h3 className="mt-4">¿Qué Hacemos?</h3>
          <ul>
            <li>Documentamos avistamientos de aves en todo Chile</li>
            <li>Educamos sobre las especies nativas</li>
            <li>Generamos conciencia sobre la importancia de la conservación</li>
            <li>Creamos una comunidad de amantes de las aves</li>
          </ul>

          <h3 className="mt-4">Contacto</h3>
          <p>
            ¿Tienes preguntas o sugerencias? Escríbenos a: 
            <strong> contacto@avesdechile.cl</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SobreNosotros