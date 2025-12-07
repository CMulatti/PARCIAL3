import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [touched, setTouched] = useState({
    username: false,
    password: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Validation errors
  const errors = {
    username: !formData.username.trim() ? 'Este campo es obligatorio' : '',
    password: !formData.password ? 'Este campo es obligatorio' : ''
  };

  const isValid = (field) => !errors[field];

  const fieldClass = (field) => {
    if (!touched[field]) return 'form-control';
    return isValid(field) ? 'form-control is-valid' : 'form-control is-invalid';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    //Mark all fields as touched
    setTouched({ username: true, password: true });

    // Check if all fields are valid
    if (!isValid('username') || !isValid('password')) {
      return;
    }

    setLoading(true);
    //backend call, if backend response is success, token/username/role/isAuthenticated get stored in LocalStorage for other components to read; otherwise, error message
    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Credenciales incorrectas');
      }

      const data = await response.json();

      //store in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('isAuthenticated', 'true');

      //redirect based on role
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Iniciar Sesión</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} noValidate>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Usuario: <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={fieldClass('username')}
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={loading}
                  />
                  {touched.username && errors.username && (
                    <div className="invalid-feedback d-block">
                      {errors.username}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña: <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className={fieldClass('password')}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={loading}
                  />
                  {touched.password && errors.password && (
                    <div className="invalid-feedback d-block">
                      {errors.password}
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </form>

              <div className="mt-3 text-center">
                <small>
                ¿No tienes una cuenta?{' '}
                <Link to="/register">Regístrate aquí</Link>
                <br />
                Credenciales de BD: pedro/pedro1234 , admin/admin1234
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;