import { Link, useNavigate } from 'react-router-dom'

export default function NavBar() {
  const navigate = useNavigate()
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  const userRole = localStorage.getItem('userRole')
  
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userRole')
    navigate('/login')
  }

  return (
    <nav className="navbar navbar-expand-lg bg-black text-uppercase fixed-top" id="mainNav">
      <div className="container-fluid">
        {/*logo with Bootstrap dropdown */}
        <div className="dropdown">
          <a
            className="navbar-brand dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <img
              src="/bird-logo.png"
              alt="Aves de Chile logo"
              style={{ height: '40px', width: 'auto' }}
            />
            Aves de Chile
          </a>
          
          <ul className="dropdown-menu">
            <li>
              <Link to="/" className="dropdown-item">
              Inicio
              </Link>
            </li>
            <li>
              <Link to="/datos-curiosos" className="dropdown-item">
              Datos Curiosos
              </Link>
            </li>
            <li>
              <Link to="/sobre-nosotros" className="dropdown-item">
              Sobre Nosotros
              </Link>
            </li>
          </ul>
        </div>
        
        
        {/*Hamburger Menu Botton taken from freelancer. This is only for mobile version/small screens*/}
        <button
          className="navbar-toggler text-uppercase font-weight-bold bg-primary text-white rounded"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
        >
          Menu
          <i className="fas fa-bars"></i>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item mx-0 mx-lg-1">
              <Link to="/" className="nav-link py-3 px-0 px-lg-3 rounded">
                Inicio
              </Link>
            </li>
            
            {/* Show Admin link ONLY to admins */}
            {isAuthenticated && userRole === 'admin' && (
              <li className="nav-item mx-0 mx-lg-1">
                <Link to="/admin" className="nav-link py-3 px-0 px-lg-3 rounded">
                  Admin
                </Link>
              </li>
            )}
            
            {/*Login or Logout button */}
            {!isAuthenticated ? (
              <li className="nav-item mx-0 mx-lg-1">
                <Link to="/login" className="nav-link py-3 px-0 px-lg-3 rounded">
                  Ingresar
                </Link>
              </li>
            ) : (
              <li className="nav-item mx-0 mx-lg-1">
                <button
                  className="nav-link py-3 px-0 px-lg-3 rounded"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}