import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MyAccount() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Password change form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordTouched, setPasswordTouched] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [passwordSubmitted, setPasswordSubmitted] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Delete account state
  const [deleteError, setDeleteError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  //fetch user ID when component mounts
  useEffect(() => {
  const fetchUserId = async () => {
    try {
      const token = localStorage.getItem('token');
    
      const response = await fetch('http://localhost:8081/api/users/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Error al cargar datos');
      
      const currentUser = await response.json();
      setUserId(currentUser.userId);
      
    } catch (error) {
      console.error('Error fetching user ID:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchUserId();
}, [username]);

  //Password validation
  const passwordErrors = {
    currentPassword: !passwordForm.currentPassword ? 'Este campo es obligatorio' : '',
    newPassword: !passwordForm.newPassword ? 'Este campo es obligatorio' : 
                 passwordForm.newPassword.length < 6 ? 'Mínimo 6 caracteres' : '',
    confirmPassword: !passwordForm.confirmPassword ? 'Este campo es obligatorio' : 
                     passwordForm.newPassword !== passwordForm.confirmPassword ? 'Las contraseñas no coinciden' : ''
  };

  const isPasswordValid = (field) => !passwordErrors[field];

  const passwordFieldClass = (field) => {
    const show = passwordTouched[field] || passwordSubmitted;
    if (!show) return 'form-control';
    return isPasswordValid(field) ? 'form-control is-valid' : 'form-control is-invalid';
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordBlur = (e) => {
    const { name } = e.target;
    setPasswordTouched(prev => ({ ...prev, [name]: true }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordSubmitted(true);
    setPasswordError('');
    setPasswordSuccess('');

    //Validate all fields
    if (!isPasswordValid('currentPassword') || 
        !isPasswordValid('newPassword') || 
        !isPasswordValid('confirmPassword')) {
      return;
    }

    // confirmation dialogue
    if (!window.confirm('¿Estás seguro que deseas cambiar tu contraseña?')) {
      return;
    }

    setPasswordLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8081/api/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      setPasswordSuccess('Contraseña actualizada exitosamente');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordTouched({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false
      });
      setPasswordSubmitted(false);

      //Clear success message after 5"
      setTimeout(() => setPasswordSuccess(''), 5000);

    } catch (error) {
      setPasswordError(error.message || 'Error al actualizar contraseña');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    // First confirmation
    if (!window.confirm('¿Estás seguro de querer borrar tu cuenta? Esta acción es irreversible.')) {
      return;
    }

    //Second confirmation 
    if (!window.confirm('Esta es tu última oportunidad. ¿Realmente deseas eliminar tu cuenta de forma permanente?')) {
      return;
    }

    setDeleteError('');
    setDeleteLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8081/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      //success, Clear localStorage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isAuthenticated');
      
      alert('Cuenta eliminada exitosamente. Serás redirigido a la página principal.');
      navigate('/');

    } catch (error) {
      setDeleteError(error.message || 'Error al eliminar cuenta');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="mb-4">Mi Cuenta</h1>

          {/* User Info card */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Información de Usuario</h5>
              <p className="mb-1">
                <strong>Usuario:</strong> {username}
              </p>
            </div>
          </div>

          {/*Change password card */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Cambiar Contraseña</h5>

              {passwordSuccess && (
                <div className="alert alert-success" role="alert">
                  {passwordSuccess}
                </div>
              )}

              {passwordError && (
                <div className="alert alert-danger" role="alert">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} noValidate>
                {/* current password */}
                <div className="mb-3">
                  <label htmlFor="currentPassword" className="form-label">
                    Contraseña actual: <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className={passwordFieldClass('currentPassword')}
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordInputChange}
                    onBlur={handlePasswordBlur}
                    disabled={passwordLoading}
                  />
                  {(passwordTouched.currentPassword || passwordSubmitted) && passwordErrors.currentPassword && (
                    <div className="invalid-feedback d-block">
                      {passwordErrors.currentPassword}
                    </div>
                  )}
                </div>

                {/* New password */}
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">
                    Nueva contraseña: <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className={passwordFieldClass('newPassword')}
                    id="newPassword"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordInputChange}
                    onBlur={handlePasswordBlur}
                    disabled={passwordLoading}
                    placeholder="Mínimo 6 caracteres"
                  />
                  {(passwordTouched.newPassword || passwordSubmitted) && passwordErrors.newPassword && (
                    <div className="invalid-feedback d-block">
                      {passwordErrors.newPassword}
                    </div>
                  )}
                </div>

                {/*confirm new password */}
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmar nueva contraseña: <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    className={passwordFieldClass('confirmPassword')}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordInputChange}
                    onBlur={handlePasswordBlur}
                    disabled={passwordLoading}
                  />
                  {(passwordTouched.confirmPassword || passwordSubmitted) && passwordErrors.confirmPassword && (
                    <div className="invalid-feedback d-block">
                      {passwordErrors.confirmPassword}
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
                </button>
              </form>
            </div>
          </div>

          {/*Delete Account card */}
          <div className="card border-danger">
            <div className="card-body">
              <h5 className="card-title text-danger">Eliminar mi cuenta</h5>
              <p className="text-muted mb-3">
                Cuidado! Una vez que elimines tu cuenta, esta acción es irreversible.
              </p>

              {deleteError && (
                <div className="alert alert-danger" role="alert">
                  {deleteError}
                </div>
              )}

              <button 
                className="btn btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Eliminando...' : 'Eliminar Mi Cuenta'}
              </button>
            </div>
          </div>

          
          <div className="mt-4">
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('/')}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;