import { useNavigate } from 'react-router-dom'

function DatosCuriosos() {
  const navigate = useNavigate()

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-4" onClick={() => navigate('/')}>
        Volver al Inicio
      </button>
      
      <header className="text-center mb-5">
        <h1 className="display-3 fw-bold text-primary">Datos Curiosos</h1>
        <p className="lead text-muted">Descubre información fascinante sobre las aves de Chile</p>
      </header>

      {/* Main content card*/}
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0">
            <div className="card-body p-5">

              <h2 className="card-title text-center mb-4">
                Conoce a Fiu, la estrella de los Juegos Panamericanos
              </h2>
              
              {/*Image and Text Side by Side */}
              <div className="row align-items-center">
                {/* Image column*/}
                <div className="col-md-5 text-center mb-4 mb-md-0">
                  <img 
                    src="/fiu.png" 
                    alt="Fiu pic" 
                    className="img-fluid rounded shadow"
                    style={{ maxHeight: '300px' }}
                  />
                  <p className="text-muted mt-2 small">Fiu, Ave de siete colores</p>
                </div>
                
                {/* All the info */}
                <div className="col-md-7">
                  <p className="fs-5">
                    <strong>Fiu</strong>, la mascota de los Juegos Panamericanos Santiago 2023, 
                    se basa en el ave de siete colores <em>Tachuris rubrigastra</em> de Chile, 
                    destacándose por su colorido y hábitat en humedales.
                  </p>
                  
                  <p className="fs-5">
                    Su nombre proviene del sonido de su canto, es muy pequeño 
                    (mide unos <strong>11.5 cm</strong> y pesa menos de <strong>8 gramos</strong>), 
                    y es un símbolo de la biodiversidad chilena.
                  </p>
                  
                  <p className="fs-5">
                    Durante los juegos, se convirtió en un <strong>"rockstar"</strong> que ayudó 
                    a visibilizar la importancia de proteger su hábitat y el medio ambiente. 
                  </p>
                </div>
              </div>

              {/* get in touch card */}
              <div className="card mt-4 border-primary">
                <div className="card-body text-center">
                  <h5 className="card-title">¿Tienes preguntas o sugerencias?</h5>
                  <p className="card-text">
                    Escríbenos a: <strong className="text-primary">contacto@avesdechile.cl</strong>
                  </p>
                </div>
              </div>

            </div> {/*closes card-body */}
          </div> {/* closes card */}
        </div> {/*closes col-lg-10 */}
      </div> {/* closes row */}
    </div> //closes container 
  )
}

export default DatosCuriosos