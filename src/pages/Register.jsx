import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [touched, setTouched] = useState({
    username: false,
    password: false,
    confirmPassword: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [usernameExists, setUsernameExists] = useState(false);

  const navigate = useNavigate();

  // Validation errors
  const errors = {
    username: !formData.username.trim() ? 'Este campo es obligatorio' : 
              formData.username.length < 3 ? 'Mínimo 3 caracteres' : 
              usernameExists ? 'El nombre de usuario no se encuentra disponible' : '',
    password: !formData.password ? 'Este campo es obligatorio' : 
              formData.password.length < 6 ? 'Mínimo 6 caracteres' : '',
    confirmPassword: !formData.confirmPassword ? 'Este campo es obligatorio' : 
                     formData.password !== formData.confirmPassword ? 'Las contraseñas no coinciden' : ''
  };

  const isValid = (field) => !errors[field];

  const fieldClass = (field) => {
    if (!touched[field]) return 'form-control';
    return isValid(field) ? 'form-control is-valid' : 'form-control is-invalid';
  };

  // Check if username exists
  const checkUsernameExists = async (username) => {
    if (username.length < 3) return;
    
    try {
      const response = await fetch(`http://localhost:8081/api/users/exists/${username}`);
      const exists = await response.json();
      setUsernameExists(exists);
    } catch (error) {
      console.error('Error checking username:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'username') {
      checkUsernameExists(value);
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Mark all fields as touched
    setTouched({ username: true, password: true, confirmPassword: true });

    // Check if all fields are valid
    if (!isValid('username') || !isValid('password') || !isValid('confirmPassword')) {
      return;
    }

    setLoading(true);

    try {
      // Step 1: Register the user
      const registerResponse = await fetch('http://localhost:8081/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      if (!registerResponse.ok) {
        const errorText = await registerResponse.text();
        throw new Error(errorText);
      }

      // Step 2: Immediately log them in
      const loginResponse = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        })
      });

      if (!loginResponse.ok) {
        throw new Error('Error al iniciar sesión automáticamente');
      }

      const loginData = await loginResponse.json();

      // Step 3: Store auth data
      localStorage.setItem('token', loginData.token);
      localStorage.setItem('username', loginData.username);
      localStorage.setItem('userRole', loginData.role);
      localStorage.setItem('isAuthenticated', 'true');

      // Step 4: Show success
      setSuccess(true);
      
      // Step 5: Redirect to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (error) {
      setError(error.message || 'Error al registrar usuario');
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
              <h2 className="card-title text-center mb-4">Registrarse</h2>
              
              {/* Success Message */}
              {success && (
                <div className="alert alert-success" role="alert">
                  ✅ Usuario registrado exitosamente! Iniciando sesión...
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Username */}
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Nombre de usuario: <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={fieldClass('username')}
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={loading || success}
                    placeholder="Mínimo 3 caracteres"
                  />
                  {touched.username && errors.username && (
                    <div className="invalid-feedback d-block">
                      {errors.username}
                    </div>
                  )}
                  {touched.username && isValid('username') && (
                    <div className="valid-feedback d-block">
                      ✓ Nombre de usuario disponible
                    </div>
                  )}
                </div>

                {/* Password */}
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
                    disabled={loading || success}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {touched.password && errors.password && (
                    <div className="invalid-feedback d-block">
                      {errors.password}
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmar contraseña: <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className={fieldClass('confirmPassword')}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={loading || success}
                    placeholder="Repite tu contraseña"
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <div className="invalid-feedback d-block">
                      {errors.confirmPassword}
                    </div>
                  )}
                  {touched.confirmPassword && isValid('confirmPassword') && (
                    <div className="valid-feedback d-block">
                      ✓ Las contraseñas coinciden
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading || success}
                >
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>
              </form>

              {/* Link to Login */}
              <div className="mt-3 text-center">
                <small>
                  ¿Ya tienes una cuenta?{' '}
                  <Link to="/login">Inicia sesión aquí</Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;